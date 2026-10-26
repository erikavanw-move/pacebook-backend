import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { connectDB } from "../config/db.config.js";
import Service from "../models/service.model.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, "..", "data", "services.json");

await connectDB();

const existing = await Service.countDocuments();

if (existing > 0) {
  console.log(`ℹ️  La colección "services" ya tiene ${existing} servicios. No se cargó nada.`);
} else {
  const raw = await fs.readFile(SEED_PATH, "utf-8");
  
  const services = JSON.parse(raw).map(({ id, ...rest }) => rest);

  const inserted = await Service.insertMany(services);
  console.log(`✅ Se cargaron ${inserted.length} servicios en MongoDB.`);
}

await mongoose.disconnect();
