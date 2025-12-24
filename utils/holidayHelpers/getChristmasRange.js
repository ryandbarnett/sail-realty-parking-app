const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

// Returns a tuple [start, end] representing the range from
// Christmas Eve (Dec 24) to January 4 (inclusive).
function getChristmasRange(year) {
  const start = DateTime.fromObject(
    { year, month: 12, day: 24 },
    { zone: TIMEZONE }
  );

  const end = DateTime.fromObject(
    { year: year + 1, month: 1, day: 4 },
    { zone: TIMEZONE }
  );

  return [start, end];
}

module.exports = getChristmasRange;
