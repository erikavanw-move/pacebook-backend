import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "..", "data", "bookings.json");

const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"];

class BookingManager {
  constructor() {
    this.bookings = this.#loadBookings();
  }

  // ---- Persistencia interna ----

  #loadBookings() {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  }

  #saveBookings() {
    fs.writeFileSync(DATA_PATH, JSON.stringify(this.bookings, null, 2));
  }

  #generateId() {
    return this.bookings.length > 0
      ? Math.max(...this.bookings.map((b) => b.id)) + 1
      : 1;
  }

  // ---- API pública ----

  getBookings() {
    return this.bookings;
  }

  getBookingById(id) {
    const booking = this.bookings.find((b) => b.id === Number(id));
    return booking || { error: `No existe una reserva con id ${id}` };
  }

  createBooking(bookingData) {
    const missing = REQUIRED_FIELDS.filter(
      (field) => bookingData[field] === undefined
    );

    if (missing.length > 0) {
      return { error: `Faltan campos requeridos: ${missing.join(", ")}` };
    }

    const newBooking = {
      id: this.#generateId(),
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status || "pending",
      services: Array.isArray(bookingData.services) ? bookingData.services : [],
    };

    this.bookings.push(newBooking);
    this.#saveBookings();
    return newBooking;
  }

  addServiceToBooking(bookingId, serviceId) {
    const index = this.bookings.findIndex((b) => b.id === Number(bookingId));

    if (index === -1) {
      return { error: `No existe una reserva con id ${bookingId}` };
    }

    const booking = this.bookings[index];
    const sid = Number(serviceId);
    const existente = booking.services.find((s) => s.service === sid);

    if (existente) {
      existente.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }

    this.#saveBookings();
    return booking;
  }
}

export default BookingManager;
