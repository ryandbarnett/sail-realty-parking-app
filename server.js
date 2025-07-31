require('dotenv').config();

const express = require('express');
const path = require('path');
const { DateTime } = require('luxon');

const db = require('./utils/db'); // Initializes DB
const { handleCreateCheckoutSession } = require('./controllers/checkoutController');
const getRemainingAllowedParkingHours = require('./utils/dateUtils/getRemainingAllowedParkingHours');
const { TIMEZONE } = require('./utils/constants');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check — defined early for fast access even if other things are broken
app.get('/health', (req, res) => {
  res.send('OK');
});

app.use(express.static(path.join(__dirname, 'public')));

// Route: Stripe checkout session
app.post('/create-checkout-session', handleCreateCheckoutSession);

// Route: Remaining allowed parking hours
app.get('/remaining-hours', (req, res) => {
  try {
    const now = DateTime.now().setZone(TIMEZONE);
    const hours = getRemainingAllowedParkingHours(now);
    res.json({ remainingHours: hours });
  } catch (err) {
    console.error('Error calculating remaining hours:', err);
    res.status(500).json({ error: 'Failed to calculate remaining hours' });
  }
});

app.get('/admin/transactions', (req, res) => {
  const now = DateTime.now().setZone(TIMEZONE).toMillis();

  db.all('SELECT * FROM payments ORDER BY paid_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Failed to fetch payments:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const formatted = rows.map((row) => {
      const isActive = row.expire_time > now;

      return {
        id: row.id,
        licensePlate: row.license_plate,
        hours: row.hours,
        startTime: DateTime.fromMillis(row.start_time).toISO(),
        expireTime: DateTime.fromMillis(row.expire_time).toISO(),
        paidAt: DateTime.fromMillis(row.paid_at).toISO(),
        stripeSessionId: row.stripe_session_id,
        isActive, // 👈 Add this field for the frontend
      };
    });

    res.json({ transactions: formatted });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});