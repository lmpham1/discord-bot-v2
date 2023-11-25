const sqlite3 = require('sqlite3').verbose();

function deleteThread(discord_thread_id, filename) {
  return new Promise((resolve, reject) => {
    if (!discord_thread_id) {
      reject('Error! discord_thread_id must be provided');
    }

    // open the database
    const db = new sqlite3.Database(filename);

    const sql = `DELETE FROM THREADS
    WHERE discord_thread_id = ?`;

    db.run(sql, [discord_thread_id], (err) => {
      if (err) {
        reject(err);
      }
      // close the database connection
      db.close();
      resolve(discord_thread_id);
    });
  });
}

module.exports = deleteThread;
