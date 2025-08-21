// tests/controllers/checkoutController.test.js
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy123';
process.env.APP_BASE_URL = 'http://localhost:3000';

const express = require('express');
const request = require('supertest');
const { handleCreateCheckoutSession } = require('../../controllers/checkoutController');

// ✅ Force parking to always be allowed in tests
jest.mock('../../utils/dateUtils', () => ({
  isParkingAllowed: jest.fn(() => true)
}));

// ✅ Mock Stripe library so no real API calls are made
jest.mock('stripe', () => {
  return jest.fn(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'cs_test_123',
          url: 'https://checkout.stripe.com/pay/cs_test_123'
        })
      }
    }
  }));
});

describe('POST /create-checkout-session', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/create-checkout-session', handleCreateCheckoutSession);
  });

  it('returns a session URL for valid input', async () => {
    const res = await request(app)
      .post('/create-checkout-session')
      .send({ licensePlate: 'ABC123', hours: 2 });

    expect(res.status).toBe(200);
    expect(res.body.url).toBe('https://checkout.stripe.com/pay/cs_test_123');
  });

  it('rejects invalid input', async () => {
    const res = await request(app)
      .post('/create-checkout-session')
      .send({ licensePlate: '', hours: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid license plate or hours/);
  });
});
