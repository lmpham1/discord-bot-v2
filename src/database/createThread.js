const sqlite3 = require('sqlite3').verbose();

function createThread(
  discord_thread_id,
  gpt_thread_id,
  gpt_assistant_id,
  filename
) {
  return new Promise((resolve, reject) => {
    if (!discord_thread_id || !gpt_assistant_id || !gpt_thread_id) {
      reject(
        'Error! discord_thread_id, gpt_thread_id, and gpt_assistant_id must be provided'
      );
    }

    // open the database
    const db = new sqlite3.Database(filename);

    const sql = `INSERT INTO THREADS
    VALUES ($discord_thread_id, $gpt_thread_id, $gpt_assistant_id)`;

    db.run(
      sql,
      {
        $discord_thread_id: discord_thread_id,
        $gpt_thread_id: gpt_thread_id,
        $gpt_assistant_id: gpt_assistant_id,
      },
      (err) => {
        if (err) {
          reject(err);
        }
        // close the database connection
        db.close();
        resolve(discord_thread_id);
      }
    );
  });
}

module.exports = createThread;
