// tests/utils/db/initDb.test.js
const fs = require('fs');
const path = require('path');

describe('initDb uses DB_PATH and creates schema', () => {
  const TEST_DB_PATH = path.resolve(__dirname, 'test-db.sqlite');
  let db;

  beforeAll(() => {
    // Point to a temp DB before loading the db module
    process.env.DB_PATH = TEST_DB_PATH;

    // Ensure we get a fresh module instance with the new env var
    jest.resetModules();
    db = require('../../../utils/db'); // your utils/db index that initializes the DB
  });

  afterAll(async () => {
    // Close DB first
    await new Promise((resolve) => db.close(resolve));

    // Cleanup the temp file if it exists
    try {
      if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH);
      }
    } catch {
      /* ignore */
    }

    delete process.env.DB_PATH;
  });

  test('payments table exists', (done) => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='payments'",
      (err, row) => {
        expect(err).toBeNull();
        expect(row && row.name).toBe('payments');
        done();
      }
    );
  });

  test('unique index exists', (done) => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='index' AND name='ux_payments_square_id'",
      (err, row) => {
        expect(err).toBeNull();
        expect(row && row.name).toBe('ux_payments_square_id');
        done();
      }
    );
  });
});
