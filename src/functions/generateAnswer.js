const { makeAPICall } = require('../api');

async function generateAnswer(prompt, username = '') {
  const response = await makeAPICall(prompt);
  const responseWithUser = `${
    username ? `@${username} said: ${prompt}\n\n` : ''
  }${response}`;
  return responseWithUser;
}

module.exports = generateAnswer;
