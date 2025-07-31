const { DateTime } = require('luxon');
const getNewYearsDay = require('../../../utils/holidayHelpers/getNewYearsDay');
const { TIMEZONE } = require('../../../utils/constants');

describe('getNewYearsDay', () => {
  test('returns January 1st for a given year', () => {
    const year = 2025;
    const expected = DateTime.fromObject({ year, month: 1, day: 1 }, { zone: TIMEZONE });

    const result = getNewYearsDay(year);

    expect(result.toISODate()).toBe(expected.toISODate());
    expect(result.zoneName).toBe(TIMEZONE);
  });

  test('works correctly for a different year', () => {
    const year = 2030;
    const expected = DateTime.fromObject({ year, month: 1, day: 1 }, { zone: TIMEZONE });

    const result = getNewYearsDay(year);

    expect(result.toISODate()).toBe(expected.toISODate());
  });

  test('includes time set to midnight by default', () => {
    const result = getNewYearsDay(2026);
    expect(result.hour).toBe(0);
    expect(result.minute).toBe(0);
    expect(result.second).toBe(0);
  });
});