import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ override: true });

const getCloudinaryCredentials = () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

export const getConfiguredCloudinary = () => {
  const creds = getCloudinaryCredentials();

  if (!creds.cloud_name || !creds.api_key || !creds.api_secret) {
    throw new Error("Faltan variables de entorno de Cloudinary");
  }

  cloudinary.config(creds);
  return cloudinary;
};

getConfiguredCloudinary();

export default cloudinary;