// tests/controllers/stripeWebhookController.test.js
const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');
const { handleStripeWebhook } = require('../../controllers/stripeWebhookController');
const db = require('../../utils/db');

// Mock Stripe module
jest.mock('stripe', () => {
  const mockConstructEvent = jest.fn();
  return jest.fn(() => ({
    webhooks: {
      constructEvent: mockConstructEvent
    }
  }));
});

const Stripe = require('stripe');
const stripeInstance = Stripe();

jest.mock('../../utils/db', () => ({
  run: jest.fn()
}));

describe('handleStripeWebhook', () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.send = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles a valid checkout.session.completed event', () => {
    const req = {
      headers: { 'stripe-signature': 'fake-signature' },
      rawBody: Buffer.from('fake-raw-body')
    };
    const res = mockRes();

    stripeInstance.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            licensePlate: 'ABC123',
            hours: '2'
          }
        }
      }
    });

    handleStripeWebhook(req, res);

    expect(db.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO payments'),
      expect.arrayContaining(['ABC123', 2, expect.any(Number), expect.any(Number), expect.any(Number), 'cs_test_123']),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('returns 400 if metadata is missing', () => {
    const req = {
      headers: { 'stripe-signature': 'fake-signature' },
      rawBody: Buffer.from('fake-raw-body')
    };
    const res = mockRes();

    stripeInstance.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_456',
          metadata: {} // Missing fields
        }
      }
    });

    handleStripeWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid metadata' });
  });

  test('returns 400 if signature verification fails', () => {
    const req = {
      headers: { 'stripe-signature': 'invalid-sig' },
      rawBody: Buffer.from('fake-body')
    };
    const res = mockRes();

    stripeInstance.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    handleStripeWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Webhook Error: Invalid signature');
  });

  test('ignores non-checkout.session.completed events', () => {
    const req = {
      headers: { 'stripe-signature': 'fake-sig' },
      rawBody: Buffer.from('something')
    };
    const res = mockRes();

    stripeInstance.webhooks.constructEvent.mockReturnValue({
      type: 'payment_intent.succeeded', // not the event we care about
      data: {
        object: {}
      }
    });

    handleStripeWebhook(req, res);

    expect(db.run).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});