// Returns true if both DateTime objects represent the same calendar date.
function isSameDate(a, b) {
  return a.hasSame(b, 'day') && a.hasSame(b, 'month') && a.hasSame(b, 'year');
}

module.exports = isSameDate;