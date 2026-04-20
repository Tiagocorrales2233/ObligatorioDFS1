import {
	crearJugadorService,
	obtenerJugadoresService,
	obtenerJugadorPorIdService,
	actualizarJugadorService,
	eliminarJugadorService,
} from "../services/jugador.services.js";

export const crearJugador = async (req, res) => {
	try {
		const datosJugador = req.validatedBody || req.body;
		const usuarioId = req.user?.id;

		if (!usuarioId) {
			return res.status(401).json({ message: "No autorizado" });
		}

		const jugadorCreado = await crearJugadorService({
			...datosJugador,
			usuario: usuarioId,
		});

		return res.status(201).json({
			message: "Jugador creado",
			jugador: jugadorCreado,
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
