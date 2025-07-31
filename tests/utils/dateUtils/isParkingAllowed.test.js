// tests/utils/dateUtils/isParkingAllowed.test.js
const { DateTime } = require('luxon');
const isParkingAllowed = require('../../../utils/dateUtils/isParkingAllowed');
const { TIMEZONE } = require('../../../utils/constants');

describe('isParkingAllowed', () => {
  const dt = (opts) => DateTime.fromObject(opts, { zone: TIMEZONE });

  describe('weekends', () => {
    test('allows parking all day Saturday', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 7, day: 26, hour: 12 }))).toBe(true); // Saturday
    });

    test('allows parking all day Sunday', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 7, day: 27, hour: 3 }))).toBe(true); // Sunday
    });
  });

  describe('weekdays during restricted hours', () => {
    test('disallows parking Monday 9 AM', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 7, day: 28, hour: 9 }))).toBe(false); // Monday
    });

    test('disallows parking Friday 4:59 PM', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 8, day: 1, hour: 16, minute: 59 }))).toBe(false); // Friday
    });
  });

  describe('weekdays outside restricted hours', () => {
    test('allows parking Monday before 7 AM', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 7, day: 28, hour: 6 }))).toBe(true);
    });

    test('allows parking Monday at exactly 5 PM', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 7, day: 28, hour: 17 }))).toBe(true);
    });

    test('allows parking Monday after 5 PM', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 7, day: 28, hour: 18 }))).toBe(true);
    });
  });

  describe('holidays', () => {
    test('allows parking on Independence Day (July 4, 2025)', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 7, day: 4, hour: 14 }))).toBe(true); // Friday
    });

    test('allows parking on Christmas Eve (Dec 24, 2025)', () => {
      expect(isParkingAllowed(dt({ year: 2025, month: 12, day: 24, hour: 12 }))).toBe(true); // Wednesday
    });
  });
});