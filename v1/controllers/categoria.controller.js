import {crearPosicionService, obtenerPosicionPorIdService, obtenerPosicionesService,
        actualizarPosicionService, eliminarPosicionService} from '../services/categoria.services.js';
import { generateGeminiText } from '../services/gemini.services.js';

const parseGeminiJson = (value) => {
    if (!value || typeof value !== 'string') return null;

    const clean = value
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

    try {
        return JSON.parse(clean);
    } catch {
        return null;
    }
};


export const crearPosicion = async (req, res) => {
    try {
        let nuevaPosicion = req.body;
        const posicionCreadaService = await crearPosicionService(nuevaPosicion);

        const posicion = posicionCreadaService?.nombre || nuevaPosicion?.nombre;
        const prompt = `Necesito sugerencias para futbol de la posicion ${posicion}. Devuelve SOLO JSON valido con esta estructura exacta: {"jugadoresConocidos":[{"nombre":"string","club":"string","pais":"string","datoRelevante":"string"}],"datosRedundantes":["string"],"resumen":"string"}. Incluye entre 5 y 8 jugadores activos o muy conocidos de esa posicion. Los datos deben ser breves, en espanol y sin markdown.`;

        let sugerenciasIA = null;
        let sugerenciasIATexto = null;

        try {
            const iaText = await generateGeminiText(prompt);
            const parsed = parseGeminiJson(iaText);

            if (parsed) {
                sugerenciasIA = parsed;
            } else {
                sugerenciasIATexto = iaText;
            }
        } catch (error) {
            sugerenciasIATexto = `No se pudieron generar sugerencias IA: ${error?.message || 'Error desconocido'}`;
        }

        res.json({
            message: 'Posición creada',
            posicion: posicionCreadaService,
            sugerenciasIA,
            sugerenciasIATexto,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear posición', details: error?.message || 'Error desconocido' });
    }
};

export const obtenerPosicionPorId = async (req, res) => {
    const { id } = req.params;
    const posicion = await obtenerPosicionPorIdService(id);
    res.json({message: 'Posición obtenida', posicion});
};

export const obtenerPosiciones = async (req, res) => {
    const posiciones = await obtenerPosicionesService();
    res.json({message: 'Posiciones obtenidas', posiciones});
}

export const actualizarPosicion = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
    const posicionActualizada = await actualizarPosicionService(id, datosActualizados);
    res.json({message: `Posición actualizada por id ${id}`, posicion: posicionActualizada, datos: datosActualizados});
}

export const eliminarPosicion = async (req, res) => {
    const { id } = req.params;
    const posicionEliminada = await eliminarPosicionService(id);
    res.json({message: `Posición eliminada por id ${id}`, posicion: posicionEliminada});
}