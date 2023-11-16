const { makeAPICall } = require('../api');
const { encoding_for_model } = require('tiktoken');
const logger = require('../logger');

async function generateAnswer(prompt, username = '') {
  try {
    const model = process.env.OPENAI_MODEL;
    logger.debug(model);
    const enc = encoding_for_model(model);
    const token = enc.encode(prompt);
    logger.info(`Request created with ${token.length} tokens.`);
    const response = await makeAPICall(prompt);
    const responseWithUser = `${
      username ? `@${username} said: ${prompt}\n\n` : ''
    }${response}`;
    logger.info('Request completed.');
    enc.free();
    return responseWithUser;
  } catch (err) {
    logger.error('Error generating answer');
    logger.error(err);
    throw err;
  }
}

module.exports = generateAnswer;
