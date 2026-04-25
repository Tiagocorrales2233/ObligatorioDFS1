import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        enum: ["Arquero", "Defensa", "Mediocampista", "Delantero","Lateral","Volante","Extremo","Pivote", "Falso 9", "Enganche", "Carrilero", "Libero", "Centrocampista Defensivo", "Centrocampista Ofensivo"],
        required: true,
    },
    descripcion: {
        type: String,
        required: false,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Categoria", categoriaSchema);