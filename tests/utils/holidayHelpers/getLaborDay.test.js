const { DateTime } = require('luxon');
const getLaborDay = require('../../../utils/holidayHelpers/getLaborDay');
const { TIMEZONE } = require('../../../utils/constants');

describe('getLaborDay', () => {
  test('returns first Monday in September for 2025', () => {
    const result = getLaborDay(2025);
    expect(result.toISODate()).toBe('2025-09-01'); // Monday
    expect(result.weekday).toBe(1); // Monday
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns first Monday in September for 2026', () => {
    const result = getLaborDay(2026);
    expect(result.toISODate()).toBe('2026-09-07');
    expect(result.weekday).toBe(1); // Monday
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns first Monday in September for 2029', () => {
    const result = getLaborDay(2029);
    expect(result.toISODate()).toBe('2029-09-03');
    expect(result.weekday).toBe(1); // Monday
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns a DateTime object in the correct timezone', () => {
    const result = getLaborDay(2030);
    expect(result.zoneName).toBe(TIMEZONE);
  });
});