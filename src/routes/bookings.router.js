import { Router } from "express";
import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();
const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

// POST /api/bookings
router.post("/", (req, res) => {
  const resultado = bookingManager.createBooking(req.body);
  const status = resultado.error ? 400 : 201;
  res.status(status).json(resultado);
});

// GET /api/bookings/:bid
router.get("/:bid", (req, res) => {
  const resultado = bookingManager.getBookingById(req.params.bid);
  const status = resultado.error ? 404 : 200;
  res.status(status).json(resultado);
});

// POST /api/bookings/:bid/services/:sid
router.post("/:bid/services/:sid", (req, res) => {
  const { bid, sid } = req.params;

  // Valida que la reserva exista
  const reserva = bookingManager.getBookingById(bid);
  if (reserva.error) {
    return res.status(404).json(reserva);
  }

  // Valida que el servicio exista
  const servicio = serviceManager.getServiceById(sid);
  if (servicio.error) {
    return res.status(404).json(servicio);
  }

  const resultado = bookingManager.addServiceToBooking(bid, sid);
  res.status(200).json(resultado);
});

export default router;
