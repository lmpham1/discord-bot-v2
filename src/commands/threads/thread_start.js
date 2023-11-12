const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { makeAPICall } = require('../../api');
const logger = require('../../logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('thread_start')
    .setDescription('Start a new thread with GPT')
    .addStringOption((option) =>
      option.setName('input').setDescription('The input to GPT')
    ),
  usage: '/thread_start',
  async execute(interaction, client) {
    try {
      const guild = interaction.guild;
      // The user who initiated the thread
      const user = interaction.user;

      let parentChannel = guild.channels.cache.find(
        (c) => c.name === 'gpt-threads' && c.type === ChannelType.GuildText
      );

      // If the 'gpt-threads' channel does not exist, create it
      if (!parentChannel) {
        parentChannel = await guild.channels.create({
          name: 'gpt-threads',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: client.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });
      } else {
        // If 'gpt-threads' exists, update its permission overwrites to include the initiating user
        await parentChannel.permissionOverwrites.edit(user.id, {
          ViewChannel: true,
        });
      }

      // Create a private thread in the 'gpt-threads' channel
      const thread = await parentChannel.threads.create({
        name: `private-thread-${uuidv4().split('-')[0]}`,
        type: ChannelType.PrivateThread,
        reason: 'Private thread for user query',
      });

      logger.info(`new private thread created by ${user.username}`);

      await thread.join();

      await thread.members.add(user.id);

      const text = interaction.options.getString('input');
      let response = '';
      if (text) {
        const results = await makeAPICall(text);
        response = `@${user.username} said: ${text}\n\n${results}`;
      } else {
        response =
          'New thread created, ask me anything! Use `/thread_chat <prompt>` to start';
      }
      await thread.send(response);

      // Acknowledge the interaction without sending a public response
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({
        content: 'Private thread created!',
        ephemeral: true,
      });
    } catch (error) {
      logger.error(error);
      await interaction.editReply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
