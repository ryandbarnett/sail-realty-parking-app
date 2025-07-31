const { DateTime } = require('luxon');
const getMemorialDay = require('../../../utils/holidayHelpers/getMemorialDay');
const { TIMEZONE } = require('../../../utils/constants');

describe('getMemorialDay', () => {
  test('returns last Monday in May for 2025', () => {
    const result = getMemorialDay(2025);
    expect(result.toISODate()).toBe('2025-05-26');
    expect(result.weekday).toBe(1); // Monday
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns last Monday in May for 2026', () => {
    const result = getMemorialDay(2026);
    expect(result.toISODate()).toBe('2026-05-25');
    expect(result.weekday).toBe(1);
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns last Monday in May for 2027', () => {
    const result = getMemorialDay(2027);
    expect(result.toISODate()).toBe('2027-05-31');
    expect(result.weekday).toBe(1);
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns correct day regardless of which day May 31st falls on', () => {
    for (let year = 2023; year <= 2030; year++) {
      const result = getMemorialDay(year);
      expect(result.month).toBe(5);
      expect(result.weekday).toBe(1); // Monday
      expect(result.day).toBeLessThanOrEqual(31);
    }
  });
});