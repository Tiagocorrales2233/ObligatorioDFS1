import axios from "axios";

export const getModels = (req, res) => {
    res.json({ message: "List of AI models", models: ["gemini-2.5-flash"] });
};

export const useGemini25Flash = async (req, res) => {
    const text = req.body?.prompt;
    if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ message: "El campo prompt es obligatorio" });
    }

    const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_25_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ message: "Falta configurar GEMINI_API_KEY en .env" });
    }

    const MODEL = "gemini-2.5-flash";
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
    };

    const body = {
        contents: [
            { parts: [{ text }] }
        ]
    };

    try {
        const response = await axios.post(ENDPOINT, body, { headers });
        const final = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!final) {
            return res.status(502).json({
                message: "La IA no devolvio texto",
                data: response.data,
            });
        }

        return res.json({
            message: "Gemini 2.5 Flash response",
            final,
            data: response.data,
        });
    } catch (error) {
        console.error("Error Gemini:", error?.response?.data || error.message);
        return res.status(500).json({
            message: "Error al consultar Gemini",
            details: error?.response?.data || error.message,
        });
    }

};