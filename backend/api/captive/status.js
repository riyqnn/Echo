const { activeSessions } = require('./validate');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mac, sessionId } = req.query;

    if (!mac && !sessionId) {
      return res.status(400).json({ 
        message: 'Either mac or sessionId is required' 
      });
    }

    const session = activeSessions.get(mac) || activeSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        message: 'Session not found' 
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = Math.max(0, session.expiry - currentTime);

    res.status(200).json({
      sessionId: session.sessionId,
      mac: session.mac,
      wallet: session.wallet,
      active: session.active,
      remainingTime,
      quotaMB: session.quotaMB,
      dataUsed: session.dataUsed,
      startTime: session.startTime,
      grantedAt: session.grantedAt,
      expiry: session.expiry
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};