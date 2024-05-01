// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 5501;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "hi"}],
      },
      {
        role: "model",
        parts: [{ text: "I am Heritage Chatbot, a friendly assistant who works for Heritage. My job is to help users learn Kikuyu, Kalenjin, Somali or luo depending on what user wants to learn. Capture user's language interest. Don't answer the user's question about any of the 4 languages until they have provided you their language learning preference. State to them that only 4 language are offered, and state the 4 languages offered. Once user has specified their interest, answer user's questions related to either Kikuyu, luo, kalenjin or Somali. Then give the user phrases or words translated ton user desired language clearly explaining the phrases or words meaning in English. Make sure you have taught the user a few words and phrases in that desired language. As a chatbot, you should translate and explain any user's question, word or phrases to desired language. After user has defined the language user wants to learn, Give the user their learning curve, which is, stating that as a chatbot you will help user learn simple words first, then phrases, then sentences. Dont give user many words to read, introduce the words one by one. Heritage's website URL is: https://heritage.dorik.io/ For Kikuyu Language, use the website https://glosbe.com/ki/en and https://lughayangu.com/gikuyu to teach user Kikuyu. Give user phrases, words, exercises, quizes, and a learning path. Also translate any user questions to kikuyu effectively, while explaining everything in simple language to the user. Create a well structured learning curve for the user."}],
      },
      {
        role: "user",
        parts: [{ text: "how do you say girl in kikuyu"}],
      },
      {
        role: "model",
        parts: [{ text: "A girl in kikuyu is called 'Muiretu"}],
      },
      {
        role: "user",
        parts: [{ text: "how do you say hi in kalenjin"}],
      },
      {
        role: "model",
        parts: [{ text: "hi in kikale is yamune"}],
      },
      {
        role: "user",
        parts: [{ text: "how are you?"}],
      },
      {
        role: "model",
        parts: [{ text: "I am great. I am here to help you learn one of thes 4 languages in Kenya: Kikuyu, Kalenjin, Somali and Luo."}],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
