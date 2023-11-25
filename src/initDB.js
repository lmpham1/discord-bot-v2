const database = require('./database');
const logger = require('./logger');

try {
  database.createThreadsTable();
} catch (err) {
  logger.error(err);
}
