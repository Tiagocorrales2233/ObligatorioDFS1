import {crearPosicionService, obtenerPosicionPorIdService, obtenerPosicionesService,
        actualizarPosicionService, eliminarPosicionService} from '../services/categoria.services.js';


export const crearPosicion = async (req, res) => {
    let nuevaPosicion = req.body;
    const posicionCreadaService = await crearPosicionService(nuevaPosicion);
    res.json({message: 'Posición creada', posicion: posicionCreadaService});
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