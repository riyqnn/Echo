const { exec } = require('child_process');
const { promisify } = require('util');
const { activeSessions, sessionTimeouts } = require('./validate');

const execAsync = promisify(exec);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mac, wallet, sessionId, duration, quota } = req.body;

    if (!mac || !sessionId) {
      return res.status(400).json({ 
        message: 'Missing required fields: mac, sessionId' 
      });
    }

    // 1. Validasi session
    const session = activeSessions.get(sessionId);
    if (!session || session.mac !== mac) {
      return res.status(400).json({ 
        message: 'Invalid session or MAC mismatch' 
      });
    }

    if (session.active) {
      return res.status(409).json({ 
        message: 'Session already active' 
      });
    }

    try {
      // 2. Buka akses internet dengan iptables
      // Hapus rule blocking jika ada
      await execAsync(`iptables -D FORWARD -m mac --mac-source ${mac} -j DROP 2>/dev/null || true`);
      
      // Tambah rule untuk allow akses dengan quota limit
      await execAsync(`iptables -I FORWARD -m mac --mac-source ${mac} -m quota --quota ${quota}M -j ACCEPT`);
      
      // Set rule untuk block setelah quota habis
      await execAsync(`iptables -A FORWARD -m mac --mac-source ${mac} -j DROP`);

      console.log(`Internet access granted for MAC ${mac} with ${quota}MB quota`);

    } catch (error) {
      console.error('iptables error:', error);
      return res.status(500).json({ 
        message: 'Failed to configure network access' 
      });
    }

    // 3. Aktifkan session
    session.active = true;
    session.grantedAt = Math.floor(Date.now() / 1000);
    activeSessions.set(mac, session);
    activeSessions.set(sessionId, session);

    // 4. Set auto-expire timer
    const timeoutId = setTimeout(async () => {
      await module.exports.revokeAccess(mac, sessionId);
    }, duration * 1000);

    sessionTimeouts.set(sessionId, timeoutId);

    // 5. Log aktivitas
    console.log(`Access granted:`, {
      mac,
      wallet,
      sessionId,
      duration,
      quota,
      expiresAt: new Date((Math.floor(Date.now() / 1000) + duration) * 1000).toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Internet access granted',
      sessionId,
      mac,
      duration,
      quota,
      grantedAt: session.grantedAt
    });

  } catch (error) {
    console.error('Grant access error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Fungsi untuk revoke access
module.exports.revokeAccess = async function(mac, sessionId) {
  try {
    const session = activeSessions.get(sessionId);
    // Hapus semua iptables rules untuk MAC ini
    await execAsync(`iptables -D FORWARD -m mac --mac-source ${mac} -m quota --quota ${session.quotaMB}M -j ACCEPT 2>/dev/null || true`);
    await execAsync(`iptables -D FORWARD -m mac --mac-source ${mac} -j DROP 2>/dev/null || true`);
    
    // Block MAC dari akses internet
    await execAsync(`iptables -I FORWARD -m mac --mac-source ${mac} -j DROP`);

    // Clean up session data
    if (session) {
      session.active = false;
      session.endTime = Math.floor(Date.now() / 1000);
    }

    // Clear timeout
    const timeoutId = sessionTimeouts.get(sessionId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      sessionTimeouts.delete(sessionId);
    }

    console.log(`Access revoked for MAC ${mac}, session ${sessionId}`);

  } catch (error) {
    console.error('Error revoking access:', error);
  }
};