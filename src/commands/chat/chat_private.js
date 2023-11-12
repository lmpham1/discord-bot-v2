const { SlashCommandBuilder } = require('discord.js');
const generateAnswer = require('../../functions/generateAnswer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat_private')
    .setDescription('Chat with GPT (Private Mode)')
    .addStringOption((option) =>
      option.setName('input').setDescription('The input to GPT')
    ),
  async execute(interaction) {
    const text = interaction.options.getString('input');
    const username = interaction.user.username;
    await interaction.deferReply({ ephemeral: true });
    const response = await generateAnswer(text, username);
    await interaction.editReply(response);
  },
};
