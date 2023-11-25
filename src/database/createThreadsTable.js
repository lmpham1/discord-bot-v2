const logger = require('../logger');

const sqlite3 = require('sqlite3').verbose();

function createThreadsTable(filename) {
  // open the database
  const db = new sqlite3.Database(filename);
  const sql = `CREATE TABLE IF NOT EXISTS threads (
    discord_thread_id TEXT PRIMARY KEY,
    gpt_thread_id TEXT NOT NULL,
    gpt_assistant_id TEXT NOT NULL
  )`;
  db.run(sql, (err) => {
    if (err) {
      // Table creation failed
      logger.error(err.message);
    } else {
      // Table created successfully or already exists
      logger.info('Table created or already exists');
    }
    db.close();
  });
}

module.exports = createThreadsTable;
