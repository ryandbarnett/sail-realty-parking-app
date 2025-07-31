const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

// Returns Independence Day (July 4th) for the given year.
function getIndependenceDay(year) {
  return DateTime.fromObject({ year, month: 7, day: 4 }, { zone: TIMEZONE });
}

module.exports = getIndependenceDay;