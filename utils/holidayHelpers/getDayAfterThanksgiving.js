const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');
const getThanksgiving = require('./getThanksgiving');

// Returns the day after Thanksgiving (i.e., Black Friday) for the given year.
function getDayAfterThanksgiving(year) {
  // Compute Thanksgiving, then add one day
  return getThanksgiving(year).plus({ days: 1 });
}

module.exports = getDayAfterThanksgiving;