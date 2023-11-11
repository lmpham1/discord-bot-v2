// api.js

const OpenAI = require('openai');

// Function to make the API call
async function makeAPICall(message, thread = []) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    thread.push({
      role: 'user',
      content: message,
    });
    const data = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: thread,
    });
    // console.log(data.choices);

    return data.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  makeAPICall,
};
