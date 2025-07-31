const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

// Returns Christmas Eve (December 24th) for the given year.
function getChristmasEve(year) {
  return DateTime.fromObject({ year, month: 12, day: 24 }, { zone: TIMEZONE });
}

module.exports = getChristmasEve;