const { DateTime } = require('luxon');
const { TIMEZONE } = require('../utils/constants');
const { isParkingAllowed } = require('../utils/dateUtils');
const { createPaymentLink } = require('../utils/squareUtils/createPaymentLink');

async function handleCreateCheckoutSession(req, res) {
  const { licensePlate, hours } = req.body;

  // Validate inputs
  if (
    !licensePlate || typeof licensePlate !== 'string' || licensePlate.trim() === '' ||
    !hours || typeof hours !== 'number' || hours < 1 || hours > 12
  ) {
    return res.status(400).json({ error: 'Invalid license plate or hours.' });
  }

  const now = DateTime.now().setZone(TIMEZONE);

  // ✅ Allow-Anytime override for live smoke tests
  const allowAnytime = process.env.ALLOW_PARKING_ANYTIME === 'true';
  if (!allowAnytime && !isParkingAllowed(now)) {
    return res.status(400).json({ error: 'Parking is not allowed at this time. Please try during allowed hours.' });
  }

  try {
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      throw new Error('Square is not configured (missing SQUARE_ACCESS_TOKEN).');
    }

    const link = await createPaymentLink({ licensePlate, hours });
    if (!link?.url) throw new Error('Square did not return a payment link URL');

    return res.json({ url: link.url, provider: 'square', id: link.id || null });
  } catch (err) {
    console.error('Payment session creation error:', {
      message: err.message,
      code: err.code,
      type: err.type,
      stack: err.stack,
    });

    res.status(500).json({
      error: 'Failed to create payment session.',
      details: err.message,
      code: err.code || 'UNKNOWN',
      type: err.type || 'Error',
    });
  }
}

module.exports = {
  handleCreateCheckoutSession,
};
