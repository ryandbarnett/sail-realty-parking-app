// utils/dateUtils/isParkingAllowed.js
const { DateTime } = require('luxon');
const { TIMEZONE } = require('../constants');
const isRecognizedHoliday = require('./isRecognizedHoliday');

// Returns true if parking is allowed at the given date/time.
function isParkingAllowed(date = DateTime.now().setZone(TIMEZONE)) {
  const day = date.weekday; // 1 = Monday, ..., 7 = Sunday
  const hour = date.hour;

  // Weekends (Saturday = 6, Sunday = 7) and recognized holidays are allowed all day
  if (day === 6 || day === 7 || isRecognizedHoliday(date)) return true;

  // Weekdays: parking allowed before 7 AM or after 5 PM
  if (day >= 1 && day <= 5) {
    if (hour < 7 || hour >= 17) return true;
  }

  return false;
}

module.exports = isParkingAllowed;