const sqlite3 = require('sqlite3').verbose();

function getByDiscordThreadId(discord_thread_id, filename) {
  return new Promise((resolve, reject) => {
    if (!discord_thread_id) {
      reject('Error! discord_thread_id must be provided');
    }

    // open the database
    const db = new sqlite3.Database(filename);

    const sql = `SELECT gpt_thread_id, gpt_assistant_id FROM THREADS
            WHERE discord_thread_id = ?`;

    const params = [discord_thread_id];

    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      }
      if (!row || Object.keys(row).length === 0) {
        reject(`No thread found with discord id ${discord_thread_id}`);
      }
      // close the database connection
      db.close();
      resolve({ ...row });
    });
  });
}

module.exports = getByDiscordThreadId;
