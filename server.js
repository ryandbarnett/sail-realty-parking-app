// Load environment variables
const environment = process.env.NODE_ENV || 'development';
const envFile = environment === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: envFile });

const express = require('express');
const path = require('path');
const { DateTime } = require('luxon');

const db = require('./utils/db'); // Initializes DB
const { handleCreateCheckoutSession } = require('./controllers/checkoutController');
const getRemainingAllowedParkingHours = require('./utils/dateUtils/getRemainingAllowedParkingHours');
const { TIMEZONE } = require('./utils/constants');
const { handleSquareWebhook } = require('./controllers/squareWebhookController');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Webhooks (must be BEFORE express.json so we have the raw body) ---
app.post('/webhooks/square', express.raw({ type: '*/*' }), handleSquareWebhook);

// General middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Payment routes
app.post('/create-checkout-session', handleCreateCheckoutSession);

// Parking hours route
app.get('/remaining-hours', (req, res) => {
  try {
    // ✅ TEMP OVERRIDE for live smoke test
    if (process.env.ALLOW_PARKING_ANYTIME === 'true') {
      return res.json({ remainingHours: 12 }); // any positive number works
    }

    const now = DateTime.now().setZone(TIMEZONE);
    const hours = getRemainingAllowedParkingHours(now);
    res.json({ remainingHours: hours });
  } catch (err) {
    console.error('Error calculating remaining hours:', err);
    res.status(500).json({ error: 'Failed to calculate remaining hours' });
  }
});

// Admin transaction history route
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
        // NOTE: legacy column name; now stores Square paymentId
        stripeSessionId: row.stripe_session_id,
        isActive,
      };
    });

    res.json({ transactions: formatted });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🌍 Running in ${environment} mode`);
});
