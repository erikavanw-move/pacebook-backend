import BookingsService from "../services/bookings.service.js";

const bookingsService = new BookingsService();

function handleError(res, error) {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
}

// Controller: lee req, llama al service y responde con res.
export async function createBooking(req, res) {
  try {
    const result = await bookingsService.createBooking(req.body);
    res.status(result.error ? 400 : 201).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function getBookingById(req, res) {
  try {
    const result = await bookingsService.getBookingById(req.params.bid);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function addServiceToBooking(req, res) {
  try {
    const { bid, sid } = req.params;
    const result = await bookingsService.addServiceToBooking(bid, sid);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}
