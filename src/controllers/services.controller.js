import ServicesService from "../services/services.service.js";

const servicesService = new ServicesService();

// Errores de validación de Mongoose (por ejemplo, un "duration" que no es número) → 400.
// Cualquier otro error inesperado → 500.
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
export async function getServices(req, res) {
  try {
    const { category, available } = req.query;
    const services = await servicesService.getServices({ category, available });
    res.status(200).json(services);
  } catch (error) {
    handleError(res, error);
  }
}

export async function getServiceById(req, res) {
  try {
    const result = await servicesService.getServiceById(req.params.sid);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function createService(req, res) {
  try {
    const result = await servicesService.createService(req.body);
    if (!result.error) emit(req, "service:created", result);
    res.status(result.error ? 400 : 201).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateService(req, res) {
  try {
    const result = await servicesService.updateService(req.params.sid, req.body);
    if (!result.error) emit(req, "service:updated", result);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteService(req, res) {
  try {
    const result = await servicesService.deleteService(req.params.sid);
    if (!result.error) emit(req, "service:deleted", result);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}
