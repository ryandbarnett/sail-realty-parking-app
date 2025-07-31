const { DateTime } = require('luxon');
const { TIMEZONE } = require('../../utils/constants');

const LAST_DAY_OF_MAY = 31;

// Memorial Day = Last Monday in May
function getMemorialDay(year) {
  let date = DateTime.fromObject({ year, month: 5, day: LAST_DAY_OF_MAY }, { zone: TIMEZONE });
  while (date.weekday !== 1) {
    date = date.minus({ days: 1 });
  }
  return date;
}

module.exports = getMemorialDay;