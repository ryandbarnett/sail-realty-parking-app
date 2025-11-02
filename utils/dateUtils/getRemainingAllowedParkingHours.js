// utils/dateUtils/getRemainingAllowedParkingHours.js
const { TIMEZONE } = require('../constants');
const isParkingAllowed = require('./isParkingAllowed');

function getRemainingAllowedParkingHours(startDate) {
  const start = startDate.setZone(TIMEZONE);
  let current = start.startOf('hour');

  let count = 0;
  const MAX_HOURS = 72;

  for (let i = 0; i < MAX_HOURS; i++) {
    if (!isParkingAllowed(current)) break;
    count++;
    current = current.plus({ hours: 1 });
  }

  return count;
}

module.exports = getRemainingAllowedParkingHours;