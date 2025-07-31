jest.mock('stripe');
const Stripe = require('stripe');
const createCheckoutSession = require('../../../utils/stripeUtils/createCheckoutSession');

describe('createCheckoutSession', () => {
  const mockCreate = jest.fn();
  const mockCheckout = { sessions: { create: mockCreate } };
  const mockStripeInstance = { checkout: mockCheckout };

  beforeEach(() => {
    Stripe.mockReturnValue(mockStripeInstance);
    mockCreate.mockReset();
  });

  test('creates a checkout session with correct parameters', async () => {
    const sessionUrl = 'https://stripe.com/fake-session';
    mockCreate.mockResolvedValue({ url: sessionUrl });

    const input = {
      licensePlate: 'ABC123',
      hours: 3,
      origin: 'http://localhost:3000'
    };

    const result = await createCheckoutSession(input);

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      payment_method_types: ['card'],
      line_items: [expect.objectContaining({
        price_data: expect.objectContaining({
          currency: 'usd',
          unit_amount: 1800,
        }),
        quantity: 1,
      })],
      mode: 'payment',
      success_url: 'http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/index.html',
      metadata: {
        licensePlate: 'ABC123',
        hours: '3',
      },
    }));

    expect(result.url).toBe(sessionUrl);
  });
});