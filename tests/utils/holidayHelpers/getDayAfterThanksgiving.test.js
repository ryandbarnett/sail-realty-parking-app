const { DateTime } = require('luxon');
const getDayAfterThanksgiving = require('../../../utils/holidayHelpers/getDayAfterThanksgiving');
const getThanksgiving = require('../../../utils/holidayHelpers/getThanksgiving');
const { TIMEZONE } = require('../../../utils/constants');

describe('getDayAfterThanksgiving', () => {
  test('returns the day after Thanksgiving for 2025', () => {
    const thanksgiving = getThanksgiving(2025);
    const expected = thanksgiving.plus({ days: 1 });
    const actual = getDayAfterThanksgiving(2025);

    expect(actual.toISODate()).toBe(expected.toISODate());
    expect(actual.weekday).toBe(5); // Friday
    expect(actual.zoneName).toBe(TIMEZONE);
  });

  test('returns the correct day for 2030', () => {
    const thanksgiving = getThanksgiving(2030);
    const expected = thanksgiving.plus({ days: 1 });
    const actual = getDayAfterThanksgiving(2030);

    expect(actual.toISODate()).toBe(expected.toISODate());
    expect(actual.weekday).toBe(5); // Friday
    expect(actual.zoneName).toBe(TIMEZONE);
  });
});