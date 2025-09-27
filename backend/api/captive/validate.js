const { ethers } = require('ethers');
const crypto = require('crypto');

// Setup provider untuk membaca contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.WIFI_CONTRACT_ADDRESS;
const contractABI = require('../../../contract/artifacts/contracts/WifiRegistry.sol/WifiRegistry.json').abi;
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// In-memory storage untuk active sessions (production harus pakai Redis/database)
const activeSessions = new Map();
const sessionTimeouts = new Map();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      accessCode, 
      wallet, 
      mac, 
      hotspotId, 
      voucherId, 
      quotaMB, 
      expiry 
    } = req.body;

    // 1. Validasi input
    if (!accessCode || !wallet || !mac) {
      return res.status(400).json({ 
        message: 'Missing required fields: accessCode, wallet, mac' 
      });
    }

    // 2. Cek apakah MAC sudah punya session aktif
    const existingSession = activeSessions.get(mac);
    if (existingSession && existingSession.active) {
      return res.status(409).json({ 
        message: 'Device already has active session',
        sessionId: existingSession.sessionId,
        remainingTime: Math.max(0, existingSession.expiry - Math.floor(Date.now() / 1000))
      });
    }

    // 3. Double-check voucher di blockchain
    try {
      const userVoucher = await contract.getMyVoucher(wallet);
      const isValid = await contract.isVoucherValid(wallet);
      
      if (!userVoucher || !userVoucher.accessCode || !isValid) {
        return res.status(400).json({ 
          message: 'No valid voucher found in blockchain for this wallet' 
        });
      }

      if (userVoucher.accessCode.toLowerCase() !== accessCode.toLowerCase()) {
        return res.status(400).json({ 
          message: 'Access code mismatch with blockchain voucher' 
        });
      }

      // Cek expiry
      const currentTime = Math.floor(Date.now() / 1000);
      const voucherExpiry = Number(userVoucher.expiry);
      if (voucherExpiry <= currentTime) {
        return res.status(400).json({ 
          message: 'Voucher has expired' 
        });
      }

    } catch (error) {
      console.error('Blockchain validation error:', error);
      return res.status(500).json({ 
        message: 'Failed to validate voucher with blockchain' 
      });
    }

    // 4. Generate session ID
    const sessionId = crypto.randomBytes(16).toString('hex');
    const sessionExpiry = Math.min(expiry, Math.floor(Date.now() / 1000) + 24 * 3600); // Max 24 jam

    // 5. Simpan session info
    const sessionData = {
      sessionId,
      wallet,
      mac,
      accessCode,
      hotspotId,
      quotaMB: Number(quotaMB),
      expiry: sessionExpiry,
      active: false, // Belum aktif sampai grant-access dipanggil
      startTime: Math.floor(Date.now() / 1000),
      dataUsed: 0
    };

    activeSessions.set(mac, sessionData);
    activeSessions.set(sessionId, sessionData); // Double mapping untuk kemudahan

    // 6. Log untuk monitoring
    console.log(`Session prepared for ${mac}:`, {
      sessionId,
      wallet,
      hotspotId,
      quotaMB,
      expiry: new Date(sessionExpiry * 1000).toISOString()
    });

    res.status(200).json({
      success: true,
      sessionId,
      message: 'Voucher validated successfully',
      durationSeconds: sessionExpiry - Math.floor(Date.now() / 1000),
      quotaMB: Number(quotaMB)
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      message: 'Internal server error during validation' 
    });
  }
};

// Export maps for use in other files
module.exports.activeSessions = activeSessions;
module.exports.sessionTimeouts = sessionTimeouts;