const db = require('../utils/db');
const { DateTime } = require('luxon');

function insertDummyPayment(licensePlate, hoursOffset) {
  const now = DateTime.now().toMillis();
  const hours = 2 + (hoursOffset % 3); // 2–4 hour durations

  const start = now + hoursOffset * 60 * 60 * 1000; // offset hours into future
  const end = start + hours * 60 * 60 * 1000;
  const paidAt = now;

  db.run(
    `INSERT INTO payments (license_plate, hours, start_time, expire_time, stripe_session_id, paid_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      licensePlate,
      hours,
      start,
      end,
      `sess_${Math.random().toString(36).slice(2)}`,
      paidAt,
    ],
    (err) => {
      if (err) {
        console.error('❌ Failed to insert dummy payment:', err);
      } else {
        console.log(`✅ Inserted dummy payment for ${licensePlate}`);
      }
    }
  );
}

// Insert a few fake rows
insertDummyPayment('ABC123', -2);
insertDummyPayment('XYZ789', 0);
insertDummyPayment('LMN456', 1);
insertDummyPayment('GHOST42', 5);

// Close DB after short delay
setTimeout(() => db.close(), 500);