const { DateTime } = require('luxon');
const getNewYearsEve = require('../../../utils/holidayHelpers/getNewYearsEve');
const { TIMEZONE } = require('../../../utils/constants');

describe('getNewYearsEve', () => {
  test('returns December 31st for 2025', () => {
    const result = getNewYearsEve(2025);
    expect(result.toISODate()).toBe('2025-12-31');
    expect(result.month).toBe(12);
    expect(result.day).toBe(31);
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns correct date for a leap year (2024)', () => {
    const result = getNewYearsEve(2024);
    expect(result.toISODate()).toBe('2024-12-31');
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns correct date for 2030', () => {
    const result = getNewYearsEve(2030);
    expect(result.toISODate()).toBe('2030-12-31');
    expect(result.zoneName).toBe(TIMEZONE);
  });
});