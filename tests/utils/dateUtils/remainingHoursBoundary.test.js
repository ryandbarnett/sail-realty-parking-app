const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../../utils/constants');
const isParkingAllowed = require('../../../utils/dateUtils/isParkingAllowed');
const getRemainingAllowedParkingHours = require('../../../utils/dateUtils/getRemainingAllowedParkingHours');

describe('Regression: weekday 4:15 PM should show 0 remaining hours', () => {
  test('Parking should be disallowed at 4:15 PM and remaining hours should be 0', () => {
    // Monday, November 3, 2025 at 4:15 PM Pacific
    const dt = DateTime.fromISO('2025-11-03T16:15:00', { zone: TIMEZONE });

    const allowed = isParkingAllowed(dt);
    const remaining = getRemainingAllowedParkingHours(dt);

    console.log({
      time: dt.toFormat('fff'),
      isParkingAllowed: allowed,
      remainingHours: remaining,
    });

    // At 4:15 PM on a weekday, parking is not allowed
    expect(allowed).toBe(false);
    // And no hours should be available for purchase yet (until 5 PM)
    expect(remaining).toBe(0);
  });
});
