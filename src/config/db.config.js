import mongoose from "mongoose";
import { env } from "./env.config.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error(`❌ No se pudo conectar a MongoDB: ${error.message}`);
    console.error(
      "Revisá MONGO_URI en tu .env (usuario, contraseña y nombre de la base) y que tu IP tenga acceso en Network Access de Atlas."
    );
    process.exit(1);
  }
}
