const initializeDatabase = require('./initDb');

const db = initializeDatabase(); // Uses default './db.sqlite' path

module.exports = db;