const { revokeAccess } = require('./grant-access');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mac, sessionId, reason } = req.body;

    if (!mac || !sessionId) {
      return res.status(400).json({ 
        message: 'MAC and sessionId required' 
      });
    }

    await revokeAccess(mac, sessionId);

    console.log(`Manual revoke: ${mac}, ${sessionId}, reason: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Access revoked successfully'
    });

  } catch (error) {
    console.error('Manual revoke error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};