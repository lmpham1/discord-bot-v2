const { encoding_for_model } = require('tiktoken');
const logger = require('../logger');
const formatAnswer = require('./formatAnswer');

async function generateAnswer(prompt, username = '', apiCall, ...args) {
  try {
    const model = process.env.OPENAI_MODEL;
    const enc = encoding_for_model(model);
    const token = enc.encode(prompt);
    logger.info(`Request created with ${token.length} tokens.`);
    const response = await apiCall(prompt, ...args);
    const responseWithUser = formatAnswer(response, prompt, username);
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
