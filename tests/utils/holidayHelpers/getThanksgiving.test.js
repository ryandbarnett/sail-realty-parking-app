const { DateTime } = require('luxon');
const getThanksgiving = require('../../../utils/holidayHelpers/getThanksgiving');
const { TIMEZONE } = require('../../../utils/constants');

describe('getThanksgiving', () => {
  test('returns the correct Thanksgiving date for 2025', () => {
    const thanksgiving = getThanksgiving(2025);
    expect(thanksgiving.toISODate()).toBe('2025-11-27');
    expect(thanksgiving.weekday).toBe(4); // Thursday
    expect(thanksgiving.zoneName).toBe(TIMEZONE);
  });

  test('returns the correct Thanksgiving date for 2024 (leap year)', () => {
    const thanksgiving = getThanksgiving(2024);
    expect(thanksgiving.toISODate()).toBe('2024-11-28');
    expect(thanksgiving.weekday).toBe(4);
    expect(thanksgiving.zoneName).toBe(TIMEZONE);
  });

  test('returns the correct Thanksgiving date for 2030', () => {
    const thanksgiving = getThanksgiving(2030);
    expect(thanksgiving.toISODate()).toBe('2030-11-28');
    expect(thanksgiving.weekday).toBe(4);
    expect(thanksgiving.zoneName).toBe(TIMEZONE);
  });
});