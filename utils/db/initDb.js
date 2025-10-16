// utils/db/initDb.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function initializeDatabase() {
  // Prefer environment variable, fallback to local file
  const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../db.sqlite');

  // Ensure the directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Failed to connect to DB:', err);
    } else {
      console.log(`✅ Connected to SQLite DB at ${dbPath}`);
    }
  });

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        license_plate TEXT NOT NULL,
        hours INTEGER NOT NULL,
        start_time INTEGER NOT NULL,
        expire_time INTEGER NOT NULL,
        stripe_session_id TEXT NOT NULL,
        paid_at INTEGER NOT NULL
      )
    `);

    db.run(`
      CREATE UNIQUE INDEX IF NOT EXISTS ux_payments_square_id
      ON payments (stripe_session_id)
    `);
  });

  return db;
}

module.exports = initializeDatabase;
