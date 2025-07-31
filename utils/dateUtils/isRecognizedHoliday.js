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
  getChristmasEve,
  getNewYearsEve,
  isSameDate,
} = require('../holidayHelpers');

// Returns true if the provided date is a recognized holiday or in the Christmas–New Year range
function isRecognizedHoliday(date = DateTime.now().setZone(TIMEZONE)) {
  const year = date.year;

  // Static single-day holidays
  const holidays = [
    getNewYearsDay(year),
    getIndependenceDay(year),
    getMemorialDay(year),
    getLaborDay(year),
    getThanksgiving(year),
    getDayAfterThanksgiving(year),
  ];

  // Check fixed holidays
  for (const holiday of holidays) {
    if (isSameDate(date, holiday)) return true;
  }

  // Check range: Dec 24 through Dec 31 (inclusive)
  const xmasEve = getChristmasEve(year);
  const newYearsEve = getNewYearsEve(year);
  if (date >= xmasEve && date <= newYearsEve) return true;

  return false;
}

module.exports = isRecognizedHoliday;