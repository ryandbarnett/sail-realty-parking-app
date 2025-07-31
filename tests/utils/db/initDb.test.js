const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const initializeDatabase = require('../../../utils/db/initDb');

const TEST_DB_PATH = path.resolve(__dirname, 'test-db.sqlite');

describe('initializeDatabase', () => {
  let db;

  beforeAll(() => {
    db = initializeDatabase(TEST_DB_PATH);
  });

  afterAll((done) => {
    db.close(() => {
      fs.unlinkSync(TEST_DB_PATH); // Remove test DB file
      done();
    });
  });

  test('creates payments table if not exists', (done) => {
    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='payments';`,
      (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeDefined();
        expect(row.name).toBe('payments');
        done();
      }
    );
  });

  test('payments table has correct columns', (done) => {
    db.all(`PRAGMA table_info(payments);`, (err, columns) => {
      expect(err).toBeNull();

      const columnNames = columns.map(col => col.name);
      expect(columnNames).toEqual([
        'id',
        'license_plate',
        'hours',
        'start_time',
        'expire_time',
        'stripe_session_id',
        'paid_at'
      ]);
      done();
    });
  });
});