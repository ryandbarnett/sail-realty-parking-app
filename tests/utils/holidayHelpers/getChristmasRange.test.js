const { DateTime } = require('luxon');
const getChristmasRange = require('../../../utils/holidayHelpers/getChristmasRange');
const { TIMEZONE } = require('../../../utils/constants');

describe('getChristmasRange', () => {
  test('returns correct start and end dates for 2025', () => {
    const [start, end] = getChristmasRange(2025);

    expect(start.toISODate()).toBe('2025-12-24');
    expect(end.toISODate()).toBe('2025-12-31');
    expect(start.zoneName).toBe(TIMEZONE);
    expect(end.zoneName).toBe(TIMEZONE);
  });

  test('returns correct range for a different year (e.g. 2030)', () => {
    const [start, end] = getChristmasRange(2030);

    expect(start.toISODate()).toBe('2030-12-24');
    expect(end.toISODate()).toBe('2030-12-31');
    expect(start.zoneName).toBe(TIMEZONE);
    expect(end.zoneName).toBe(TIMEZONE);
  });
});
