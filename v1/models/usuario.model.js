import mongoose from  'mongoose';

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['admin', 'cliente'],
        default: 'cliente'
    },
    plan: {
        type: String,
        enum: ['plus', 'premium'],
        default: 'plus'
    }
});

export default mongoose.model('Usuario', usuarioSchema);