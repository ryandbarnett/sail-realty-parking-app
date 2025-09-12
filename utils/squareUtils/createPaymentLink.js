// utils/squareUtils/createPaymentLink.js
// Use the legacy SDK which still exposes checkoutApi.createPaymentLink
const { Client, Environment } = require('square/legacy');
const crypto = require('node:crypto');

const env =
  process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox;

const client = new Client({
  bearerAuthCredentials: {
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
  },
  environment: env,
});

async function createPaymentLink({ licensePlate, hours }) {
  const pricePerHour = 600; // cents ($6/hour)
  const amount = pricePerHour * hours;

  const { result } = await client.checkoutApi.createPaymentLink({
    idempotencyKey: crypto.randomUUID(),
    quickPay: {
      name: `Sail Parking • ${hours} hour${hours !== 1 ? 's' : ''} — ${licensePlate}`,
      priceMoney: { amount, currency: 'USD' },
      locationId: process.env.SQUARE_LOCATION_ID,
    },
    // If you want redirect after payment:
    // postCheckoutRedirectUrl: `${process.env.APP_BASE_URL}/success.html`,
  });

  return {
    url: result.paymentLink?.url,
    id: result.paymentLink?.id,
  };
}

module.exports = { createPaymentLink };
