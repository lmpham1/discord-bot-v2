const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with ChatGPT'),
  async execute(interaction) {
    await interaction.reply(`${interaction}`);
  },
};
