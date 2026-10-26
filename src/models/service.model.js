import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema.options.js";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    available: { type: Boolean, required: true },
  },
  baseSchemaOptions
);

export default mongoose.model("Service", serviceSchema);
