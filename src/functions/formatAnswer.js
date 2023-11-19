function formatAnswer(answer, prompt, username = '') {
  const responseWithUser = `${
    username ? `@${username} said: ${prompt}\n\n` : ''
  }${answer}`;
  return responseWithUser;
}

module.exports = formatAnswer;
