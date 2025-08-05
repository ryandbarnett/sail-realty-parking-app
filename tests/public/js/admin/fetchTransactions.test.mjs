/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const { fetchTransactions } = await import(
  new URL('../../../../public/js/admin/fetchTransactions.mjs', import.meta.url)
);

describe('fetchTransactions', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  test('fetches transactions from /admin/transactions', async () => {
    const fakeData = [{ id: 1, licensePlate: 'ABC123' }];
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ transactions: fakeData }),
    });

    const result = await fetchTransactions();

    expect(mockFetch).toHaveBeenCalledWith('/admin/transactions');
    expect(result).toEqual(fakeData);
  });

  test('throws if data.transactions is not an array', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ transactions: null }),
    });

    await expect(fetchTransactions()).rejects.toThrow('Unexpected data format');
  });

  test('throws if fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network fail'));

    await expect(fetchTransactions()).rejects.toThrow('Network fail');
  });
});