const { Events } = require('discord.js');
const logger = require('../logger');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      logger.error(`Error executing ${interaction.commandName}`);
      logger.error(error);
      await interaction.editReply(
        'An error occurred while processing your request.'
      );
    }
  },
};
