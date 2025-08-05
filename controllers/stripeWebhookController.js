// controllers/stripeWebhookController.js
const Stripe = require('stripe');
const { DateTime } = require('luxon');
const db = require('../utils/db');
const { TIMEZONE } = require('../utils/constants');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // ✅ Use req.rawBody, NOT req.body
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const licensePlate = session.metadata?.licensePlate;
    const hours = parseInt(session.metadata?.hours, 10);

    if (!licensePlate || isNaN(hours)) {
      console.warn('⚠️ Missing or invalid metadata:', session.metadata);
      return res.status(400).json({ error: 'Missing or invalid metadata' });
    }

    const now = DateTime.now().setZone(TIMEZONE);
    const startTime = now.toMillis();
    const expireTime = now.plus({ hours }).toMillis();
    const paidAt = now.toMillis();
    const stripeSessionId = session.id;

    db.run(
      `INSERT INTO payments (license_plate, hours, start_time, expire_time, paid_at, stripe_session_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [licensePlate, hours, startTime, expireTime, paidAt, stripeSessionId],
      (err) => {
        if (err) {
          console.error('❌ Failed to insert payment record:', err.message);
        } else {
          console.log(`✅ Payment recorded for ${licensePlate} (${hours} hour${hours !== 1 ? 's' : ''})`);
        }
      }
    );
  }

  res.json({ received: true });
}

module.exports = { handleStripeWebhook };