const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const logger = require('./logger');
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const guildIdsFile = process.argv[2];
if (!fs.existsSync(guildIdsFile)) {
  logger.error(`The file ${guildIdsFile} does not exist.`);
  process.exit(1);
}

const guildIds = fs
  .readFileSync(guildIdsFile, 'utf8')
  .split('\n')
  .filter(Boolean);

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      logger.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    for (const guildId of guildIds) {
      logger.info(
        `Started refreshing ${commands.length} application (/) commands in ${guildId}.`
      );

      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      logger.info(
        `Successfully reloaded ${data.length} application (/) commands in guild ${guildId}.`
      );
    }
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    logger.error(error);
  }
})();
