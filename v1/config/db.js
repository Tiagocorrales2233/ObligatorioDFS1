import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Aquí usamos la URL que pasaste por WhatsApp
    const url = process.env.MONGO_URI || "mongodb://localhost:27017/obligatorio_dfs";
    
    await mongoose.connect(url);
    
    console.log('MongoDB Conectado localmente');
  } catch (error) {
    console.error(` Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;