const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

// Returns New Year's Day (January 1st) for the given year.
function getNewYearsDay(year) {
  return DateTime.fromObject({ year, month: 1, day: 1 }, { zone: TIMEZONE });
}

module.exports = getNewYearsDay;