// utils/dateUtils/isRecognizedHoliday.js
const { DateTime } = require('luxon');
const { TIMEZONE } = require('../constants');
const {
  getNewYearsDay,
  getIndependenceDay,
  getMemorialDay,
  getLaborDay,
  getThanksgiving,
  getDayAfterThanksgiving,
  isSameDate,
} = require('../holidayHelpers');
const getChristmasRange = require('../holidayHelpers/getChristmasRange');

// Returns true if the provided date is a recognized holiday or in the Christmas–New Year range
function isRecognizedHoliday(date = DateTime.now().setZone(TIMEZONE)) {
  const holidayYear = date.month === 1 ? date.year - 1 : date.year;

  const holidays = [
    getNewYearsDay(date.year),
    getIndependenceDay(date.year),
    getMemorialDay(date.year),
    getLaborDay(date.year),
    getThanksgiving(date.year),
    getDayAfterThanksgiving(date.year),
  ];

  for (const holiday of holidays) {
    if (isSameDate(date, holiday)) return true;
  }

  const [xmasStart, xmasEnd] = getChristmasRange(holidayYear);
  return date >= xmasStart && date <= xmasEnd;
}


module.exports = isRecognizedHoliday;