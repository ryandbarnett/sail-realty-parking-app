const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

// Returns New Year's Eve (December 31st) for the given year.
function getNewYearsEve(year) {
  return DateTime.fromObject({ year, month: 12, day: 31 }, { zone: TIMEZONE });
}

module.exports = getNewYearsEve;