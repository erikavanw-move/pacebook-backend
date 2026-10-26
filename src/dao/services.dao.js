import mongoose from "mongoose";
import Service from "../models/service.model.js";

class ServicesDAO {
  async getAll() {
    const docs = await Service.find();
    return docs.map((doc) => doc.toObject());
  }

  async getById(id) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const doc = await Service.findById(id);
    return doc ? doc.toObject() : null;
  }

  async create(data) {
    const { id: _ignored, _id: _ignored2, ...rest } = data;
    const doc = await Service.create(rest);
    return doc.toObject();
  }

  // Devuelve el registro actualizado, o null si no existe
  async update(id, data) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const { id: _ignored, _id: _ignored2, ...rest } = data;
    const doc = await Service.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    return doc ? doc.toObject() : null;
  }

  // Idem que id y data
  async delete(id) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const doc = await Service.findByIdAndDelete(id);
    return doc ? doc.toObject() : null;
  }
}

export default ServicesDAO;
