import mongoose from "mongoose";
const jugadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  posicion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria", // Nombre del modelo de categorías
    required: true,
  },
  equipo: {
    type: String,
    required: true,
  },
  nacionalidad: {
    type: String,
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

export default mongoose.model("Jugador", jugadorSchema);
