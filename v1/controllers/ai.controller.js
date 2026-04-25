import { generateGeminiText } from "../services/gemini.services.js";

export const getModels = (req, res) => {
    res.json({ message: "List of AI models", models: ["gemini-2.5-flash"] });
};

export const useGemini25Flash = async (req, res) => {
    const text = req.body?.prompt;
    if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ message: "El campo prompt es obligatorio" });
    }

    try {
        const final = await generateGeminiText(text);

        return res.json({
            message: "Gemini 2.5 Flash response",
            final,
        });
    } catch (error) {
        console.error("Error Gemini:", error?.response?.data || error?.message || error);
        return res.status(500).json({
            message: "Error al consultar Gemini",
            details: error?.response?.data || error?.message || "Error desconocido",
        });
    }

};