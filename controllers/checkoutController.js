const { DateTime } = require('luxon');
const { TIMEZONE } = require('../utils/constants');
const { isParkingAllowed } = require('../utils/dateUtils');
const { createCheckoutSession } = require('../utils/stripeUtils');

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
    const session = await createCheckoutSession({
      licensePlate,
      hours
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session creation error:', {
    message: err.message,
    code: err.code,
    type: err.type,
    stack: err.stack,
  });
    
  res.status(500).json({
    error: 'Failed to create payment session.',
    details: err.message,   // 👈 expose Stripe’s actual error text
    code: err.code || 'UNKNOWN',
    type: err.type || 'Error',
  });
}
}

module.exports = {
  handleCreateCheckoutSession
};
