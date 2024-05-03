// /api/chat.js
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const cors = require('cors');


const API_KEY = process.env.API_KEY;
const MODEL_NAME = "gemini-pro";

app.use(cors());  // This will allow all CORS requests. For production, you should configure it to only allow specific origins.


module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const { userInput } = req.body;

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
        };

        const safetySettings = [{
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [{ role: "user", parts: [{ text: userInput }] }],
        });

        const result = await chat.sendMessage(userInput);
        const response = result.response;

        res.status(200).json({ response: response.text() });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};