/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const { setupParkingAvailabilityChecker } = await import(
  new URL('../../../public/js/parkingAvailability.mjs', import.meta.url)
);

describe('setupParkingAvailabilityChecker', () => {
  let hoursInput, messageDiv;

  beforeEach(() => {
    // Set up a basic DOM structure
    document.body.innerHTML = `
      <div id="message"></div>
      <input type="number" name="hours" value="2" />
    `;

    hoursInput = document.querySelector('[name="hours"]');
    messageDiv = document.getElementById('message');

    jest.useFakeTimers();
    mockFetch.mockReset();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('disables input and shows message if remainingHours is 0', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ remainingHours: 0 }),
    });

    setupParkingAvailabilityChecker({ hoursInput });
    await jest.advanceTimersByTimeAsync(1600);
    await Promise.resolve();

    const info = document.getElementById('hours-info');
    expect(hoursInput.disabled).toBe(true);
    expect(info.textContent).toMatch(/not allowed/i);
  });

  test('enables input and sets max when remainingHours is positive', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ remainingHours: 3 }),
    });

    setupParkingAvailabilityChecker({ hoursInput });
    await jest.advanceTimersByTimeAsync(1600);
    await Promise.resolve();

    const info = document.getElementById('hours-info');
    expect(hoursInput.disabled).toBe(false);
    expect(hoursInput.max).toBe("3"); // attribute is a string
    expect(info.textContent).toMatch(/up to 3 hours/i);
  });

  test('disables input and shows fallback message if backend sends bad response', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ somethingWeird: true }),
    });

    setupParkingAvailabilityChecker({ hoursInput });
    await jest.advanceTimersByTimeAsync(1600);
    await Promise.resolve();

    const info = document.getElementById('hours-info');
    expect(hoursInput.disabled).toBe(true);
    expect(info.textContent).toMatch(/unable to determine/i);
  });

  test('disables input and shows error if fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network down'));

    setupParkingAvailabilityChecker({ hoursInput });
    await jest.advanceTimersByTimeAsync(1600);
    await Promise.resolve();

    const info = document.getElementById('hours-info');
    expect(hoursInput.disabled).toBe(true);
    expect(info.textContent).toMatch(/error calculating/i);
  });
});