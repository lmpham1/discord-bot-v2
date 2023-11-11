const { SlashCommandBuilder } = require('discord.js');
const { makeAPICall } = require('../../api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with GPT')
    .addStringOption((option) =>
      option.setName('input').setDescription('The input to GPT')
    ),
  async execute(interaction) {
    const text = interaction.options.getString('input');
    const user = interaction.user.username;
    await interaction.deferReply();
    const response = await makeAPICall(text);
    const responseWithUser = `@${user} said: ${text}\n\n${response}`;
    await interaction.editReply(`${responseWithUser}`);
  },
};
