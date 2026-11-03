import BookingsService from "../services/bookings.service.js";

const bookingsService = new BookingsService();

// Errores de validación de Mongoose (por ejemplo, un id de servicio inválido dentro
// de "services") → 400. Cualquier otro error inesperado → 500.
function handleError(res, error) {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
}

// Avisa por Socket.io a los navegadores conectados que hubo un cambio real
function emit(req, event, payload) {
  const io = req.app.get("io");
  if (io) io.emit(event, payload);
}

// Controller: lee req, llama al service y responde con res.
export async function getBookings(req, res) {
  try {
    const bookings = await bookingsService.getBookings();
    res.status(200).json(bookings);
  } catch (error) {
    handleError(res, error);
  }
}

export async function createBooking(req, res) {
  try {
    const result = await bookingsService.createBooking(req.body);
    if (!result.error) emit(req, "booking:created", result);
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
    if (!result.error) emit(req, "booking:updated", result);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}
