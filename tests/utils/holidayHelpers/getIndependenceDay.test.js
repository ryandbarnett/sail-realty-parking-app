const { DateTime } = require('luxon');
const getIndependenceDay = require('../../../utils/holidayHelpers/getIndependenceDay');
const { TIMEZONE } = require('../../../utils/constants');

describe('getIndependenceDay', () => {
  test('returns July 4th for 2025', () => {
    const result = getIndependenceDay(2025);
    expect(result.toISODate()).toBe('2025-07-04');
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns July 4th for 2030', () => {
    const result = getIndependenceDay(2030);
    expect(result.toISODate()).toBe('2030-07-04');
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('returns a DateTime object with weekday 5 (Friday) for 2025', () => {
    const result = getIndependenceDay(2025);
    expect(result.weekday).toBe(5); // July 4, 2025 is a Friday
  });

  test('returns a DateTime object with weekday 4 (Thursday) for 2030', () => {
    const result = getIndependenceDay(2030);
    expect(result.weekday).toBe(4); // July 4, 2030 is a Thursday
  });
});