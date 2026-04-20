import Jugador from "../models/jugador.model.js";

export const crearJugadorService = async (nuevoJugador) => {
	const jugadorCreado = new Jugador(nuevoJugador);
	return await jugadorCreado.save();
};

export const obtenerJugadoresService = async () => {
	return await Jugador.find()
		// .populate("posicion")
		// .populate("usuario", "email rol plan");
};

export const obtenerJugadorPorIdService = async (id) => {
	return await Jugador.findById(id);
};

export const actualizarJugadorService = async (id, datosActualizados) => {
	const jugadorActualizado = await Jugador.findByIdAndUpdate(
		id,
		datosActualizados,
		{ returnDocument: "after" }
	)
	return jugadorActualizado;
};

export const eliminarJugadorService = async (id) => {
	return await Jugador.findByIdAndDelete(id);
};
