import BookingsService from "../services/bookings.service.js";

const bookingsService = new BookingsService();

export async function createBooking(req, res) {
  try {
    const result = await bookingsService.createBooking(req.body);
    res.status(result.error ? 400 : 201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getBookingById(req, res) {
  try {
    const result = await bookingsService.getBookingById(req.params.bid);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function addServiceToBooking(req, res) {
  try {
    const { bid, sid } = req.params;
    const result = await bookingsService.addServiceToBooking(bid, sid);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
