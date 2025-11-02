const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../../utils/constants');
const getRemainingAllowedParkingHours = require('../../../utils/dateUtils/getRemainingAllowedParkingHours');

describe('getRemainingAllowedParkingHours', () => {
  const setDate = (iso) => DateTime.fromISO(iso, { zone: TIMEZONE });

  test('returns full hours of allowed parking starting from current hour', () => {
    // From Saturday 2:30 PM to Monday 7:00 AM = 41 full hours of allowed parking
    expect(getRemainingAllowedParkingHours(setDate('2025-07-26T14:30'))).toBe(41);

    // From Sunday 12:00 AM to Monday 7:00 AM = 31 full hours (starting at midnight)
    expect(getRemainingAllowedParkingHours(setDate('2025-07-27T00:00'))).toBe(31);
  });

  test('returns full hours until parking is no longer allowed on recognized holidays', () => {
    // July 4, 2025 is a Friday (holiday), followed by a weekend
    expect(getRemainingAllowedParkingHours(setDate('2025-07-04T10:45'))).toBe(69); // until Monday 7 AM
  });

  test('returns full hours until 7AM on weekday before 7AM', () => {
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T06:10'))).toBe(1); // Less than 1 full hour but current hour counts
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T05:00'))).toBe(2); // 5–7 AM window
  });

  test('returns 0 on weekday between 7AM and 5PM', () => {
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T10:00'))).toBe(0);
  });

  test('returns full hours until 7AM next weekday when starting after 5PM', () => {
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T17:01'))).toBe(14); // from 5 PM to 7 AM next day
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T23:00'))).toBe(8);  // from 11 PM to 7 AM next day
  });

  test('handles fractional hours by rounding down', () => {
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T05:59'))).toBe(2);
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T05:01'))).toBe(2);
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T05:59:59'))).toBe(2);
  });

  test('caps at 72 hours even during long holiday periods like Christmas', () => {
    // Dec 25 is within the Dec 24–Dec 31 holiday range
    expect(getRemainingAllowedParkingHours(setDate('2025-12-25T10:00'))).toBe(72);
  });

  test('does not exceed allowed hours near end of holiday range', () => {
    // Dec 31 is the last holiday, so only a few hours left before Jan 1 (weekday rules resume)
    expect(getRemainingAllowedParkingHours(setDate('2025-12-31T22:00'))).toBe(33);
  });

  test('returns 0 if current time is during a no-parking window and next hour is also restricted', () => {
    // Tuesday 3:15 PM — currently disallowed, and next hour (4:00 PM) is also disallowed
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T15:15'))).toBe(0);
  });

  test('starts counting immediately even if current time has minutes/seconds', () => {
    // From 6:59:59 PM to 7 AM = 13 full hours
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T18:59:59'))).toBe(13);
  });

  test('includes current hour if exactly on the hour', () => {
    // From 5 PM → should now allow 14 full hours
    expect(getRemainingAllowedParkingHours(setDate('2025-07-29T17:00'))).toBe(14);
  });
});
