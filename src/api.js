// api.js

const OpenAI = require('openai');
const logger = require('./logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to make the API call to Chat Completion endpoint
async function makeChatCompletionCall(message, thread = []) {
  try {
    thread.push({
      role: 'user',
      content: message,
    });
    const data = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: thread,
    });
    logger.debug(data);

    return data.choices[0].message.content;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

async function makeObjectCreationCall(type, name = '') {
  try {
    switch (type) {
      case 'assistant': {
        const assistant = await openai.beta.assistants.create({
          model: process.env.OPENAI_MODEL,
        });
        logger.debug('assistant created!');
        logger.debug(assistant);
        return assistant;
      }
      case 'thread': {
        const thread = await openai.beta.threads.create({
          metadata: { name },
        });
        logger.debug('thread created!');
        logger.debug(thread);
        return thread;
      }
      default:
        return;
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

async function makeThreadRunCall(prompt, assistant, thread) {
  try {
    if (!prompt) {
      throw new Error('prompt is empty');
    }
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });
    let run_result = {};
    do {
      run_result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    } while (run_result.status !== 'completed');
    const response = await openai.beta.threads.messages.list(thread.id);
    return response.data[0].content[0].text.value;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

module.exports = {
  makeChatCompletionCall,
  makeObjectCreationCall,
  makeThreadRunCall,
};
