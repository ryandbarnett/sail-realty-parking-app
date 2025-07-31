const Stripe = require('stripe');
const { DateTime } = require('luxon');
const { TIMEZONE } = require('../constants');

// Creates a Stripe Checkout session for parking
async function createCheckoutSession({ licensePlate, hours, origin }) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // ← moved inside
  const pricePerHour = 600; // cents ($6)
  const amount = pricePerHour * hours;

  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Parking (${hours} hour${hours > 1 ? 's' : ''})`,
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/index.html`,
    metadata: {
      licensePlate,
      hours: hours.toString(),
    },
  });
}

module.exports = createCheckoutSession;