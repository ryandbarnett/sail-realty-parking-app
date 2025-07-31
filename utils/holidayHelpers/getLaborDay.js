const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

// Returns Labor Day (first Monday in September) for the given year.
function getLaborDay(year) {
  let date = DateTime.fromObject({ year, month: 9, day: 1 }, { zone: TIMEZONE });

  // Loop forward until we find a Monday
  while (date.weekday !== 1) {
    date = date.plus({ days: 1 });
  }

  return date;
}

module.exports = getLaborDay;