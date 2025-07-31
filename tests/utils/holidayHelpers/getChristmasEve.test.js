const { DateTime } = require('luxon');
const getChristmasEve = require('../../../utils/holidayHelpers/getChristmasEve');
const { TIMEZONE } = require('../../../utils/constants');

describe('getChristmasEve', () => {
  test('returns December 24th for the given year', () => {
    const year = 2025;
    const expected = DateTime.fromObject({ year, month: 12, day: 24 }, { zone: TIMEZONE });
    const result = getChristmasEve(year);
    expect(result.toISODate()).toBe(expected.toISODate());
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('works correctly for a different year', () => {
    const year = 2030;
    const expected = DateTime.fromObject({ year, month: 12, day: 24 }, { zone: TIMEZONE });
    const result = getChristmasEve(year);
    expect(result.toISODate()).toBe(expected.toISODate());
    expect(result.zoneName).toBe(TIMEZONE);
  });
});