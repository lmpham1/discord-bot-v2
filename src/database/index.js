const path = require('path');
const createThreadsTable = require('./createThreadsTable');
const getByDiscordThreadId = require('./getByDiscordThreadId');
const createThread = require('./createThread');
const updateAssistant = require('./updateAssistant');
const deleteThread = require('./deleteThread');
const filename = path.join(__dirname, 'gpt-bot.db');

module.exports = {
  createThreadsTable: () => createThreadsTable(filename),
  getByDiscordThreadId: async (discord_thread_id) =>
    await getByDiscordThreadId(discord_thread_id, filename),
  createThread: async (discord_thread_id, gpt_thread_id, gpt_assistant_id) =>
    await createThread(
      discord_thread_id,
      gpt_thread_id,
      gpt_assistant_id,
      filename
    ),
  updateAssistant: async (discord_thread_id, gpt_assistant_id) =>
    await updateAssistant(discord_thread_id, gpt_assistant_id, filename),
  deleteThread: async (discord_thread_id) =>
    await deleteThread(discord_thread_id, filename),
};
