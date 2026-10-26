import mongoose from "mongoose";
import Booking from "../models/booking.model.js";

class BookingsDAO {
  
  async create(data) {
    const { id: _ignored, _id: _ignored2, ...rest } = data;
    const doc = await Booking.create(rest);
    return doc.toObject();
  }

  async getById(id) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const doc = await Booking.findById(id);
    return doc ? doc.toObject() : null;
  }

  // Devuelve la reserva actualizada, o null si no existe
  async update(id, data) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const { id: _ignored, _id: _ignored2, ...rest } = data;
    const doc = await Booking.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    return doc ? doc.toObject() : null;
  }
}

export default BookingsDAO;
