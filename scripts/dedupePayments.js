// scripts/dedupePayments.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../db.sqlite');
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

(async () => {
  try {
    console.log('➡️ DB:', dbPath);

    // 1) Show duplicates before
    const dups = await all(`
      SELECT stripe_session_id AS paymentId, COUNT(*) AS copies
      FROM payments
      GROUP BY stripe_session_id
      HAVING copies > 1
      ORDER BY copies DESC
    `);
    console.log('🔎 Duplicates BEFORE:', dups);

    // 2) Keep the earliest row per paymentId, delete the rest
    await run(`
      WITH kept AS (
        SELECT MIN(id) AS id
        FROM payments
        GROUP BY stripe_session_id
      )
      DELETE FROM payments
      WHERE id NOT IN (SELECT id FROM kept)
    `);

    // 3) Create unique index (safe if it already exists)
    await run(`
      CREATE UNIQUE INDEX IF NOT EXISTS ux_payments_square_id
      ON payments (stripe_session_id)
    `);

    // 4) Show duplicates after
    const after = await all(`
      SELECT stripe_session_id AS paymentId, COUNT(*) AS copies
      FROM payments
      GROUP BY stripe_session_id
      HAVING copies > 1
      ORDER BY copies DESC
    `);
    console.log('✅ Duplicates AFTER:', after);

    console.log('🎉 Done.');
  } catch (e) {
    console.error('❌ Error:', e);
  } finally {
    db.close();
  }
})();
