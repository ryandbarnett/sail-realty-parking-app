// utils/db/initDb.js
const sqlite3 = require('sqlite3').verbose();

function initializeDatabase(dbPath = './db.sqlite') {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Failed to connect to DB:', err);
    } else {
      console.log('✅ Connected to SQLite DB.');
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
  });

  return db;
}

module.exports = initializeDatabase;