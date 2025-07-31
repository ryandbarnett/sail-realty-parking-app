// tests/utils/dateUtils/isRecognizedHoliday.test.js
const { DateTime } = require('luxon');
const isRecognizedHoliday = require('../../../utils/dateUtils/isRecognizedHoliday');
const { TIMEZONE } = require('../../../utils/constants');

describe('isRecognizedHoliday', () => {
  const year = 2025;
  const zone = TIMEZONE;

  const date = (month, day) => DateTime.fromObject({ year, month, day }, { zone });

  test.each([
    ['New Year\'s Day', 1, 1],
    ['Memorial Day', 5, 26], // 2025-05-26
    ['Independence Day', 7, 4],
    ['Labor Day', 9, 1], // 2025-09-01
    ['Thanksgiving', 11, 27],
    ['Day after Thanksgiving', 11, 28],
    ['Christmas Eve', 12, 24],
    ['Christmas Day (from range)', 12, 25],
    ['New Year\'s Eve', 12, 31],
  ])('returns true for %s', (_, month, day) => {
    const dt = date(month, day);
    expect(isRecognizedHoliday(dt)).toBe(true);
  });

  test('returns false for a random non-holiday date', () => {
    const dt = date(6, 15); // June 15th isn't a holiday
    expect(isRecognizedHoliday(dt)).toBe(false);
  });

  test('returns false for null input', () => {
    expect(() => isRecognizedHoliday(null)).toThrow();
  });
});