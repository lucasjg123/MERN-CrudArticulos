import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const conexion = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado Correctamente");
  } catch (e) {
    console.log(e);
  }
};
