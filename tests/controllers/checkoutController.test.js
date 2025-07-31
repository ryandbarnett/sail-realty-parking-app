const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');
const isParkingAllowed = require('../../utils/dateUtils/isParkingAllowed');
const createCheckoutSession = require('../../utils/stripeUtils/createCheckoutSession');
const { handleCreateCheckoutSession } = require('../../controllers/checkoutController');

jest.mock('../../utils/dateUtils/isParkingAllowed');
jest.mock('../../utils/stripeUtils/createCheckoutSession');

describe('handleCreateCheckoutSession', () => {
  const mockReq = (body) => ({
    body,
    headers: { origin: 'http://localhost:3000' },
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 if licensePlate or hours are invalid', async () => {
    const res = mockRes();

    await handleCreateCheckoutSession(mockReq({ licensePlate: '', hours: 2 }), res);
    expect(res.status).toHaveBeenCalledWith(400);

    await handleCreateCheckoutSession(mockReq({ licensePlate: 'ABC', hours: 0 }), res);
    expect(res.status).toHaveBeenCalledWith(400);

    await handleCreateCheckoutSession(mockReq({ licensePlate: 'ABC' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 400 if parking is not allowed', async () => {
    isParkingAllowed.mockReturnValue(false);
    const res = mockRes();

    await handleCreateCheckoutSession(mockReq({ licensePlate: 'ABC123', hours: 2 }), res);
    expect(isParkingAllowed).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringMatching(/parking is not allowed/i),
    }));
  });

  test('returns Stripe session URL on success', async () => {
    isParkingAllowed.mockReturnValue(true);
    createCheckoutSession.mockResolvedValue({ url: 'https://fake-stripe.com/success' });

    const res = mockRes();
    const req = mockReq({ licensePlate: 'XYZ987', hours: 4 });

    await handleCreateCheckoutSession(req, res);

    expect(createCheckoutSession).toHaveBeenCalledWith(expect.objectContaining({
      licensePlate: 'XYZ987',
      hours: 4,
      origin: 'http://localhost:3000',
    }));
    expect(res.json).toHaveBeenCalledWith({ url: 'https://fake-stripe.com/success' });
  });

  test('returns 500 on Stripe failure', async () => {
    isParkingAllowed.mockReturnValue(true);
    createCheckoutSession.mockRejectedValue(new Error('Stripe died'));

    const res = mockRes();
    await handleCreateCheckoutSession(mockReq({ licensePlate: 'ERR', hours: 2 }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringMatching(/failed to create/i),
    }));
  });
});