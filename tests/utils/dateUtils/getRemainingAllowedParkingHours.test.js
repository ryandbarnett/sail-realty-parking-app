const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../../utils/constants');
const getRemainingAllowedParkingHours = require('../../../utils/dateUtils/getRemainingAllowedParkingHours');

describe('getRemainingAllowedParkingHours', () => {
  const setDate = (iso) => DateTime.fromISO(iso, { zone: TIMEZONE });

  test('returns full hours of allowed parking starting from next hour', () => {
    // From Saturday 2:30 PM to Monday 7:00 AM = 40 full hours of allowed parking
    expect(getRemainingAllowedParkingHours(setDate('2025-07-26T14:30'))).toBe(40);

    // From Sunday 12:00 AM to Monday 7:00 AM = 30 full hours (starting at 1 AM)
    expect(getRemainingAllowedParkingHours(setDate('2025-07-27T00:00'))).toBe(30);
  });

  test('returns full hours until parking is no longer allowed on recognized holidays', () => {
    // July 4, 2025 is a Friday (holiday), followed by a weekend
    expect(getRemainingAllowedParkingHours(setDate('2025-07-04T10:45'))).toBe(68); // until Monday 7 AM
  });

  test('returns full hours until 7AM on weekday before 7AM', () => {
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T06:10'))).toBe(0); // Less than 1 full hour
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T05:00'))).toBe(1); // Only 6 AM counts
  });

  test('returns 0 on weekday between 7AM and 5PM', () => {
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T10:00'))).toBe(0);
  });

  test('returns full hours until 7AM next weekday when starting after 5PM', () => {
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T17:01'))).toBe(13); // from 6 PM to 7 AM
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T23:00'))).toBe(7);  // from midnight to 7 AM
  });

  test('handles fractional hours by rounding down', () => {
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T05:59'))).toBe(1);
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T05:01'))).toBe(1);
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T05:59:59'))).toBe(1);
  });

  test('caps at 72 hours even during long holiday periods like Christmas', () => {
    // Dec 25 is within the Dec 24–Dec 31 holiday range
    expect(getRemainingAllowedParkingHours(setDate('2025-12-25T10:00'))).toBe(72);
  });

  test('does not exceed allowed hours near end of holiday range', () => {
    // Dec 31 is the last holiday, so only a few hours left before Jan 1 (weekday rules resume)
    expect(getRemainingAllowedParkingHours(setDate('2025-12-31T22:00'))).toBe(32);
  });

  test('returns 0 if current time is during a no-parking window and next hour is also restricted', () => {
    // Tuesday 3:15 PM — currently disallowed, and next hour (4:00 PM) is also disallowed
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T15:15'))).toBe(0);
  });

  test('starts at the top of next hour if current time has minutes/seconds', () => {
    // From 6:59:59 PM to 7 AM = 12 full hours
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T18:59:59'))).toBe(12);
  });

  test('does not count current hour even if it is exactly on the hour', () => {
    // From 5 PM → should still only allow 13 full hours, not 14
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T17:00'))).toBe(13);
  });
});