import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

export async function createBooking(req, res) {
  try {
    const resultado = await bookingManager.createBooking(req.body);
    const status = resultado.error ? 400 : 201;
    res.status(status).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getBookingById(req, res) {
  try {
    const resultado = await bookingManager.getBookingById(req.params.bid);
    const status = resultado.error ? 404 : 200;
    res.status(status).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function addServiceToBooking(req, res) {
  try {
    const { bid, sid } = req.params;

  
    const reserva = await bookingManager.getBookingById(bid);
    if (reserva.error) {
      return res.status(404).json(reserva);
    }

  
    const servicio = await serviceManager.getServiceById(sid);
    if (servicio.error) {
      return res.status(404).json(servicio);
    }

    const resultado = await bookingManager.addServiceToBooking(bid, sid);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
