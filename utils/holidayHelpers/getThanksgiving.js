const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

const TARGET_WEEKDAY = 4; // 4 = Thursday (Luxon: Monday = 1, Sunday = 7)
const REQUIRED_OCCURRENCES = 4; // Thanksgiving = 4th Thursday in November

function getThanksgiving(year) {
  let date = DateTime.fromObject({ year, month: 11, day: 1 }, { zone: TIMEZONE }); // Start at Nov 1
  let thursdays = 0;

  while (thursdays < REQUIRED_OCCURRENCES) {
    if (date.weekday === TARGET_WEEKDAY) thursdays++;
    if (thursdays < REQUIRED_OCCURRENCES) {
      date = date.plus({ days: 1 });
    }
  }

  return date;
}

module.exports = getThanksgiving;