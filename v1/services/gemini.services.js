import axios from "axios";

export const generateGeminiText = async (prompt) => {
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("El prompt es obligatorio");
  }

  const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_25_API_KEY;
  if (!API_KEY) {
    throw new Error("Falta configurar GEMINI_API_KEY en .env");
  }

  const MODEL = "gemini-2.5-flash";
  const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY,
  };

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const response = await axios.post(ENDPOINT, body, { headers });
  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("La IA no devolvio texto");
  }

  return text;
};

export default generateGeminiText;