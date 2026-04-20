import axios from "axios";

export const getModels = (req, res) => {
    res.json({ message: 'List of AI models' });
};

export const useGemini25Flash = (req, res) => {
    let text = req.body.prompt;
    const API_KEY = process.env.GEMINI_25_API_KEY;
    const MODEL = 'gemini-2.5-flash';
    const ENDPOINT = http//generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent;

    const headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
    };

    const body = {
        contents: [
            { parts: [{ text }] }
        ]
    };
    axios.post(ENDPOINT, body, { headers })
        .then(response => {
            res.json({message: 'Gemini 2.5 Flash response',
                final: response.data.candidates[0].content.parts[0].text,
                data: response.data});
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while using Gemini 2.5 Flash model' });
        });

};