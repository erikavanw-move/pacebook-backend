import ServicesService from "../services/services.service.js";

const servicesService = new ServicesService();

function handleError(res, error) {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
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
    res.status(result.error ? 400 : 201).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateService(req, res) {
  try {
    const result = await servicesService.updateService(req.params.sid, req.body);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteService(req, res) {
  try {
    const result = await servicesService.deleteService(req.params.sid);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}
