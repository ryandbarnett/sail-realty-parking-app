const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

// Returns a tuple [start, end] representing the range from Christmas Eve (Dec 24)
// to New Year's Eve (Dec 31) for the given year.
function getChristmasRange(year) {
  const start = DateTime.fromObject({ year, month: 12, day: 24 }, { zone: TIMEZONE });
  const end = DateTime.fromObject({ year, month: 12, day: 31 }, { zone: TIMEZONE });
  return [start, end];
}

module.exports = getChristmasRange;