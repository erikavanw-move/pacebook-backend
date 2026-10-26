import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema.options.js";


const messageSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { ...baseSchemaOptions, timestamps: true }
);

export default mongoose.model("Message", messageSchema);
