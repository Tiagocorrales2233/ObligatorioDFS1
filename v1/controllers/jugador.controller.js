import {
	crearJugadorService,
	obtenerJugadoresService,
	obtenerJugadorPorIdService,
	actualizarJugadorService,
	eliminarJugadorService,
} from "../services/jugador.services.js";
import axios from "axios";
import { generateGeminiText } from "../services/gemini.services.js";
import Usuario from "../models/usuario.model.js";
import Jugador from "../models/jugador.model.js";
import { getConfiguredCloudinary } from "../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";

const paisesEnIngles = [
	"Argentina",
	"Brazil",
	"Spain",
	"France",
	"Germany",
	"Italy",
	"England",
	"Portugal",
	"Netherlands",
	"Belgium",
	"Uruguay",
	"Chile",
	"Mexico",
	"Colombia",
	"Ecuador",
	"Paraguay",
	"Peru",
	"United States",
	"Canada",
	"Japan",
	"South Korea",
	"Morocco",
	"Nigeria",
	"Senegal",
];

const obtenerEquipoRandomApiSports = async () => {
	const apiKey = process.env.APISPORTS_KEY || "6d857adfc997c9ba70e132d6174933d5";
	const country = paisesEnIngles[Math.floor(Math.random() * paisesEnIngles.length)];
	const url = `https://v3.football.api-sports.io/teams?country=${encodeURIComponent(country)}`;

	const response = await axios.get(url, {
		headers: {
			"x-apisports-key": apiKey,
		},
	});

	const teams = response.data?.response;
	if (!Array.isArray(teams) || teams.length === 0) {
		throw new Error(`No se encontraron equipos para ${country}`);
	}

	const randomTeam = teams[Math.floor(Math.random() * teams.length)];
	const teamName = randomTeam?.team?.name;

	if (!teamName) {
		throw new Error(`La API no devolvio un nombre de equipo para ${country}`);
	}

	return teamName;
};

const parseGeminiJson = (value) => {
	if (!value || typeof value !== "string") return null;

	const clean = value
		.replace(/^```json\s*/i, "")
		.replace(/^```\s*/i, "")
		.replace(/```$/i, "")
		.trim();

	try {
		return JSON.parse(clean);
	} catch {
		return null;
	}
};

export const crearJugador = async (req, res) => {
	try {
		const datosJugador = req.validatedBody || req.body;
		const usuarioId = req.user?.id;

		if (!usuarioId) {
			return res.status(401).json({ message: "No autorizado" });
		}

		const usuario = await Usuario.findById(usuarioId).select("plan");
		if (!usuario) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}

		const plan = String(usuario.plan || "").toLowerCase();
		if (plan === "plus") {
			const cantidadJugadores = await Jugador.countDocuments({ usuario: usuarioId });
			if (cantidadJugadores >= 4) {
				return res.status(403).json({
					message: "Limite alcanzado para plan plus",
					details: "El plan plus permite crear hasta 4 jugadores. Cambia a premium para crear ilimitados.",
				});
			}
		}

		let imagen = null;
		if (req.file?.buffer) {
			const folder = req.body?.folder || "jugadores";
			const cloudinary = getConfiguredCloudinary();
			const resultadoImagen = await uploadBufferToCloudinary(cloudinary, req.file.buffer, {
				resource_type: "auto",
				folder,
			});
			imagen = resultadoImagen.secure_url;
		}

		const equipoRandom = await obtenerEquipoRandomApiSports();

		const jugadorCreado = await crearJugadorService({
			...datosJugador,
			equipo: equipoRandom,
			imagen,
			usuario: usuarioId,
		});

		const prompt = `Genera caracteristicas ficticias e inventadas para este jugador de futbol recien creado: nombre ${jugadorCreado?.nombre || datosJugador?.nombre}, apellido ${jugadorCreado?.apellido || datosJugador?.apellido}, edad ${jugadorCreado?.edad || datosJugador?.edad}, equipo ${jugadorCreado?.equipo || datosJugador?.equipo}, nacionalidad ${jugadorCreado?.nacionalidad || datosJugador?.nacionalidad}, posicionId ${jugadorCreado?.posicion || datosJugador?.posicion}. Devuelve SOLO JSON valido con esta estructura exacta: {"perfilFicticio":{"apodo":"string","piernaHabil":"string","estiloDeJuego":"string","fortalezas":["string"],"debilidades":["string"],"historiaInventada":"string"},"estadisticasInventadas":{"velocidad":0,"tiro":0,"pase":0,"defensa":0,"fisico":0},"datoCurioso":"string"}. Las estadisticas deben ir de 1 a 99. Todo en espanol y sin markdown.`;

		let caracteristicasIA = null;
		let caracteristicasIATexto = null;

		try {
			const iaText = await generateGeminiText(prompt);
			const parsed = parseGeminiJson(iaText);

			if (parsed) {
				caracteristicasIA = parsed;
			} else {
				caracteristicasIATexto = iaText;
			}
		} catch (error) {
			caracteristicasIATexto = `No se pudieron generar caracteristicas IA: ${error?.message || "Error desconocido"}`;
		}

		return res.status(201).json({
			message: "Jugador creado",
			jugador: jugadorCreado,
			equipoAsignado: equipoRandom,
			imagen,
			caracteristicasIA,
			caracteristicasIATexto,
		});
	} catch (error) {
		console.error("Error al crear jugador:", error);
		return res.status(500).json({
			message: "Error al crear jugador",
			details: error?.message || "Error desconocido",
		});
	}
};

export const obtenerJugadores = async (req, res) => {
	try {
		const jugadores = await obtenerJugadoresService();
		return res.json({
			message: "Jugadores obtenidos",
			jugadores,
		});
	} catch (error) {
		console.error("Error al obtener jugadores:", error);
		return res.status(500).json({
			message: "Error al obtener jugadores",
			details: error?.message || "Error desconocido",
		});
	}
};

export const obtenerJugadorPorId = async (req, res) => {
	try {
		const { id } = req.params;
		const jugador = await obtenerJugadorPorIdService(id);

		if (!jugador) {
			return res.status(404).json({ message: "Jugador no encontrado" });
		}

		return res.json({
			message: "Jugador obtenido",
			jugador,
		});
	} catch (error) {
		console.error("Error al obtener jugador:", error);
		return res.status(500).json({
			message: "Error al obtener jugador",
			details: error?.message || "Error desconocido",
		});
	}
};

export const actualizarJugador = async (req, res) => {
	try {
		const { id } = req.params;
		const datosActualizados = req.validatedBody || req.body;
		const jugadorActualizado = await actualizarJugadorService(id, datosActualizados);

		if (!jugadorActualizado) {
			return res.status(404).json({ message: "Jugador no encontrado" });
		}

		return res.json({
			message: `Jugador actualizado por id ${id}`,
			jugador: jugadorActualizado,
		});
	} catch (error) {
		console.error("Error al actualizar jugador:", error);
		return res.status(500).json({
			message: "Error al actualizar jugador",
			details: error?.message || "Error desconocido",
		});
	}
};

export const eliminarJugador = async (req, res) => {
	try {
		const { id } = req.params;
		const jugadorEliminado = await eliminarJugadorService(id);

		if (!jugadorEliminado) {
			return res.status(404).json({ message: "Jugador no encontrado" });
		}

		return res.json({
			message: `Jugador eliminado por id ${id}`,
			jugador: jugadorEliminado,
		});
	} catch (error) {
		console.error("Error al eliminar jugador:", error);
		return res.status(500).json({
			message: "Error al eliminar jugador",
			details: error?.message || "Error desconocido",
		});
	}
};
