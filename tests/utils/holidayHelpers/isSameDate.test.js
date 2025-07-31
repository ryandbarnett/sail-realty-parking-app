const { DateTime } = require('luxon');
const { isSameDate } = require('../../../utils/holidayHelpers');

describe('isSameDate', () => {
  const zone = 'America/Los_Angeles';

  test('returns true for identical dates', () => {
    const a = DateTime.fromObject({ year: 2025, month: 7, day: 4 }, { zone });
    const b = DateTime.fromObject({ year: 2025, month: 7, day: 4 }, { zone });
    expect(isSameDate(a, b)).toBe(true);
  });

  test('returns false if day is different', () => {
    const a = DateTime.fromObject({ year: 2025, month: 7, day: 4 }, { zone });
    const b = DateTime.fromObject({ year: 2025, month: 7, day: 5 }, { zone });
    expect(isSameDate(a, b)).toBe(false);
  });

  test('returns false if month is different', () => {
    const a = DateTime.fromObject({ year: 2025, month: 6, day: 4 }, { zone });
    const b = DateTime.fromObject({ year: 2025, month: 7, day: 4 }, { zone });
    expect(isSameDate(a, b)).toBe(false);
  });

  test('returns false if year is different', () => {
    const a = DateTime.fromObject({ year: 2024, month: 7, day: 4 }, { zone });
    const b = DateTime.fromObject({ year: 2025, month: 7, day: 4 }, { zone });
    expect(isSameDate(a, b)).toBe(false);
  });

  test('returns true even if times are different (same calendar date)', () => {
    const a = DateTime.fromObject({ year: 2025, month: 12, day: 25, hour: 0 }, { zone });
    const b = DateTime.fromObject({ year: 2025, month: 12, day: 25, hour: 23 }, { zone });
    expect(isSameDate(a, b)).toBe(true);
  });
});