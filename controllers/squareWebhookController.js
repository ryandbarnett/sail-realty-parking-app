// controllers/squareWebhookController.js
const { WebhooksHelper } = require('square');
const { Client, Environment } = require('square/legacy');
const { DateTime } = require('luxon');
const db = require('../utils/db');
const { TIMEZONE } = require('../utils/constants');

const SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
const NOTIFICATION_URL = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;

const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

// dev helper: allow local curl
const SKIP_VERIFY = process.env.SKIP_SQUARE_SIGNATURE_VERIFICATION === 'true';

function isValid(req) {
  if (SKIP_VERIFY) return true;
  const signatureHeader = req.get('x-square-hmacsha256-signature');
  if (!signatureHeader || !SIGNATURE_KEY || !NOTIFICATION_URL) return false;
  const requestBody = req.body instanceof Buffer ? req.body.toString('utf8') : '';
  return WebhooksHelper.verifySignature({
    requestBody,
    signatureHeader,
    signatureKey: SIGNATURE_KEY,
    notificationUrl: NOTIFICATION_URL,
  });
}

function parsePlateAndHoursFromName(name) {
  // Expected: "Sail Parking • {hours} hour(s) — {PLATE}"
  if (!name) return { licensePlate: null, hours: null };
  const parts = name.split('—').map(s => s.trim());
  const left = parts[0] || '';
  const licensePlate = (parts[1] || '').trim() || null;
  const m = left.match(/(\d+)\s*hour/i);
  const hours = m ? Number(m[1]) : null;
  return { licensePlate, hours };
}

async function handleSquareWebhook(req, res) {
  try {
    if (!isValid(req)) return res.status(400).send('Invalid signature');

    const event = JSON.parse(req.body.toString('utf8'));

    if (event.type !== 'payment.updated') {
      return res.status(200).send('Ignored');
    }

    const payment = event?.data?.object?.payment;
    const status = payment?.status;
    const paymentId = payment?.id;
    const orderId = payment?.order_id || payment?.orderId;
    const createdAt = payment?.created_at || event?.created_at;

    if (status !== 'COMPLETED') {
      // not finalized yet
      return res.status(200).send(`Ignored status=${status}`);
    }

    // Try to read the line item name (holds hours & plate)
    let licensePlate = null;
    let hours = null;
    try {
      if (orderId) {
        const { result } = await client.ordersApi.retrieveOrder(orderId);
        const line = result?.order?.lineItems?.[0];
        if (line?.name) {
          ({ licensePlate, hours } = parsePlateAndHoursFromName(line.name));
        }
      }
    } catch (e) {
      console.warn('Could not retrieve order:', e?.message || e);
    }

    // Fallbacks
    if (!hours) {
      const cents = payment?.total_money?.amount ?? 0;
      hours = Math.max(1, Math.min(12, Math.round(cents / 600))); // $6/hr
    }
    if (!licensePlate) licensePlate = 'UNKNOWN';

    // Convert timestamps to millis (your admin route expects millis)
    const start = DateTime.fromISO(createdAt, { zone: TIMEZONE }).isValid
      ? DateTime.fromISO(createdAt, { zone: TIMEZONE })
      : DateTime.now().setZone(TIMEZONE);

    const startMs = start.toMillis();
    const endMs = start.plus({ hours }).toMillis();
    const paidAtMs = startMs;

    // Insert into existing schema; reuse legacy column to store Square paymentId
    const stmt = db.prepare(`
      INSERT INTO payments (license_plate, hours, start_time, expire_time, paid_at, stripe_session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(licensePlate, hours, startMs, endMs, paidAtMs, paymentId);

    console.log('✅ Recorded Square payment:', {
      paymentId, licensePlate, hours,
      start: start.toISO(), end: DateTime.fromMillis(endMs).toISO()
    });

    return res.status(200).send('OK');
  } catch (err) {
    console.error('Square webhook error:', err);
    return res.status(500).send('Server error');
  }
}

module.exports = { handleSquareWebhook };
