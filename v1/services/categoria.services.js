import Categoria from '../models/categoria.model.js';

export const crearPosicionService = async (nuevaPosicion) => {
    const posicionCreada = new Categoria(nuevaPosicion);
    return await posicionCreada.save();
}

export const obtenerPosicionesService = async () => {
    return await Categoria.find();
}

export const obtenerPosicionPorIdService = async (id) => {
    const posicion = await Categoria.findById(id);
    return posicion;
}

export const actualizarPosicionService = async (id, datosActualizados) => {
    const posicionActualizada = await Categoria.findByIdAndUpdate(id, datosActualizados, {returnDocument: 'after'});
    return posicionActualizada;
}

export const eliminarPosicionService = async (id) => {
    return await Categoria.findByIdAndDelete(id);
}

