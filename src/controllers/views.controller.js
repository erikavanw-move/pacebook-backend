import ServicesService from "../services/services.service.js";
import BookingsService from "../services/bookings.service.js";

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

// Controller de vistas: igual que los de la API, solo llama a la capa de services
// y renderiza. No tiene reglas de negocio ni accede a la base de datos.
export async function renderServices(req, res) {
  try {
    const services = await servicesService.getServices();
    res.render("services", { title: "Servicios", services });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
}

export async function renderBookings(req, res) {
  try {
    const bookings = await bookingsService.getBookings();
    res.render("bookings", { title: "Reservas", bookings });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
}
