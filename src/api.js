// api.js

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to make the API call
async function makeAPICall(message, thread = []) {
  try {
    const openai = new OpenAIApi(configuration);
    thread.push({
      role: 'user',
      content: message,
    });
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL,
      messages: thread,
    });

    const data = response.data;
    // console.log(data.choices);

    return data.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  makeAPICall,
};
