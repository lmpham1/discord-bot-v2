const { SlashCommandBuilder } = require('discord.js');
const generateAnswer = require('../../functions/generateAnswer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with GPT')
    .addStringOption((option) =>
      option.setName('input').setDescription('The input to GPT')
    ),
  usage: '/chat <INPUT>',
  async execute(interaction) {
    const text = interaction.options.getString('input');
    const username = interaction.user.username;
    await interaction.deferReply();
    const response = await generateAnswer(text, username);
    await interaction.editReply(response);
  },
};
