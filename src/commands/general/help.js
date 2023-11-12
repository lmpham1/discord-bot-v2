const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of all available commands'),

  async execute(interaction, client) {
    let replyMessage = 'Here are the available commands:\n\n';

    // Loop through the commands collection
    client.commands.forEach((cmd) => {
      replyMessage += `\`${cmd.usage ?? '/' + cmd.data.name}\`: ${
        cmd.data.description
      }\n\n`;
    });

    // Send the list of commands as a reply
    await interaction.reply({ content: replyMessage, ephemeral: true });
  },
};
