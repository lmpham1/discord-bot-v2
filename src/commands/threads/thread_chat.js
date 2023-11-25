const { SlashCommandBuilder, ChannelType } = require('discord.js');
const logger = require('../../logger');
const { makeThreadRunCall } = require('../../api');
const generateAnswer = require('../../functions/generateAnswer');
const database = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('thread_chat')
    .setDescription('Continue your GPT thread. Context will be maintained.')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('The input to GPT')
        .setRequired(true)
    ),
  usage: '/thread_chat <INPUT>',
  async execute(interaction) {
    try {
      const guild = interaction.guild;

      const parentChannel = guild.channels.cache.find(
        (c) => c.name === 'gpt-threads' && c.type === ChannelType.GuildText
      );

      // If the 'gpt-threads' channel does not exist, create it
      if (
        !parentChannel ||
        interaction.channel.type === 'GUILD_PRIVATE_THREAD'
      ) {
        throw new Error('Command can only be used in a gpt-thread');
      }

      // Acknowledge the interaction without sending a public response
      await interaction.deferReply({ ephemeral: true });

      const discord_thread_id = interaction.channelId;

      const { gpt_thread_id, gpt_assistant_id } =
        await database.getByDiscordThreadId(discord_thread_id);

      const text = interaction.options.getString('input');
      const response = await generateAnswer(
        text,
        interaction.user.username,
        makeThreadRunCall,
        gpt_assistant_id,
        gpt_thread_id
      );

      await interaction.editReply(response);
    } catch (error) {
      logger.error(error);
      await interaction.editReply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
      throw error;
    }
  },
};
