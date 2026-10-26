import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesService from "./services.service.js";

const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"];

class BookingsService {
  constructor() {
    this.repository = new BookingsRepository();
    this.servicesService = new ServicesService();
  }

  async createBooking(bookingData) {
    const missing = REQUIRED_FIELDS.filter(
      (field) => bookingData[field] === undefined
    );

    if (missing.length > 0) {
      return { error: `Faltan campos requeridos: ${missing.join(", ")}` };
    }

    return await this.repository.create({
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status || "pending",
      services: Array.isArray(bookingData.services) ? bookingData.services : [],
    });
  }

  async getBookingById(id) {
    const booking = await this.repository.getById(id);
    return booking || { error: `No existe una reserva con id ${id}` };
  }

  async addServiceToBooking(bookingId, serviceId) {
   
    const booking = await this.repository.getById(bookingId);
    if (!booking) {
      return { error: `No existe una reserva con id ${bookingId}` };
    }

    // Regla: el servicio debe existir (se consulta a la capa de services)
    const service = await this.servicesService.getServiceById(serviceId);
    if (service.error) {
      return { error: service.error };
    }

    // Info clave: si el servicio ya estaba en la reserva, se incrementa quantity.
    const existing = booking.services.find(
      (s) => String(s.service) === service.id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      booking.services.push({ service: service.id, quantity: 1 });
    }

    return await this.repository.update(bookingId, booking);
  }
}

export default BookingsService;
