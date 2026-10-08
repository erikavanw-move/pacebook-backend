import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "..", "data", "bookings.json");

const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"];

class BookingManager {
  // Persistencia interna (asíncrona)

  async #readBookings() {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  }

  async #writeBookings(bookings) {
    await fs.writeFile(DATA_PATH, JSON.stringify(bookings, null, 2));
  }

  #generateId(bookings) {
    return bookings.length > 0
      ? Math.max(...bookings.map((b) => b.id)) + 1
      : 1;
  }

  // API pública

  async getBookings() {
    return await this.#readBookings();
  }

  async getBookingById(id) {
    const bookings = await this.#readBookings();
    const booking = bookings.find((b) => b.id === Number(id));
    return booking || { error: `No existe una reserva con id ${id}` };
  }

  async createBooking(bookingData) {
    const missing = REQUIRED_FIELDS.filter(
      (field) => bookingData[field] === undefined
    );

    if (missing.length > 0) {
      return { error: `Faltan campos requeridos: ${missing.join(", ")}` };
    }

    const bookings = await this.#readBookings();

    const newBooking = {
      id: this.#generateId(bookings),
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status || "pending",
      services: Array.isArray(bookingData.services) ? bookingData.services : [],
    };

    bookings.push(newBooking);
    await this.#writeBookings(bookings);
    return newBooking;
  }

  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this.#readBookings();
    const index = bookings.findIndex((b) => b.id === Number(bookingId));

    if (index === -1) {
      return { error: `No existe una reserva con id ${bookingId}` };
    }

    const booking = bookings[index];
    const sid = Number(serviceId);
    const existente = booking.services.find((s) => s.service === sid);

    if (existente) {
      existente.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }

    await this.#writeBookings(bookings);
    return booking;
  }
}

export default BookingManager;
