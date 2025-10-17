// tests/controllers/checkoutController.square.test.js
const { handleCreateCheckoutSession } = require('../../controllers/checkoutController');

// Mock the Square helper and date utils
jest.mock('../../utils/squareUtils/createPaymentLink', () => ({
  createPaymentLink: jest.fn(),
}));
jest.mock('../../utils/dateUtils', () => ({
  isParkingAllowed: jest.fn(() => true),
}));
const { createPaymentLink } = require('../../utils/squareUtils/createPaymentLink');
const { isParkingAllowed } = require('../../utils/dateUtils');

function makeRes() {
  return {
    _status: 200,
    _json: null,
    status(code) { this._status = code; return this; },
    json(obj) { this._json = obj; return this; },
  };
}

describe('handleCreateCheckoutSession (Square)', () => {
  beforeEach(() => {
    process.env.SQUARE_ACCESS_TOKEN = 'test_sandbox_token';
    process.env.ALLOW_PARKING_ANYTIME = 'true'; // bypass time rules for test
    isParkingAllowed.mockReturnValue(true);
    jest.clearAllMocks();
  });

  test('400 on invalid input', async () => {
    const req = { body: { licensePlate: '', hours: 0 } };
    const res = makeRes();

    await handleCreateCheckoutSession(req, res);
    expect(res._status).toBe(400);
    expect(res._json).toHaveProperty('error');
  });

  test('200 with Square link on valid input', async () => {
    createPaymentLink.mockResolvedValue({
      url: 'https://square.test/link',
      id: 'plink_123',
    });

    const req = { body: { licensePlate: 'ABC123', hours: 2 } };
    const res = makeRes();

    await handleCreateCheckoutSession(req, res);

    expect(createPaymentLink).toHaveBeenCalledWith({ licensePlate: 'ABC123', hours: 2 });
    expect(res._status).toBe(200);
    expect(res._json).toEqual({ url: 'https://square.test/link', provider: 'square', id: 'plink_123' });
  });

  test('500 if Square not configured', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {}); // silence expected error

    delete process.env.SQUARE_ACCESS_TOKEN;
    const req = { body: { licensePlate: 'XYZ789', hours: 1 } };
    const res = makeRes();

    await handleCreateCheckoutSession(req, res);

    expect(res._status).toBe(500);
    expect(res._json).toHaveProperty('error');

    spy.mockRestore(); // restore console.error afterward
  });
});
