// tests/utils/stripeUtils/createCheckoutSession.test.js
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy123';
process.env.APP_BASE_URL = 'http://localhost:3000';

const createCheckoutSession = require('../../../utils/stripeUtils/createCheckoutSession');

// Mock the Stripe library
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

describe('createCheckoutSession', () => {
  it('creates a checkout session with correct parameters', async () => {
    const session = await createCheckoutSession({
      licensePlate: 'ABC123',
      hours: 2
    });

    // Verify mocked response comes back
    expect(session.url).toBe('https://checkout.stripe.com/pay/cs_test_123');
  });
});
