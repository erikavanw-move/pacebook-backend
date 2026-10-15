import ServicesService from "../services/services.service.js";

const servicesService = new ServicesService();

export async function getServices(req, res) {
  try {
    const { category, available } = req.query;
    const services = await servicesService.getServices({ category, available });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getServiceById(req, res) {
  try {
    const result = await servicesService.getServiceById(req.params.sid);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createService(req, res) {
  try {
    const result = await servicesService.createService(req.body);
    res.status(result.error ? 400 : 201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateService(req, res) {
  try {
    const result = await servicesService.updateService(req.params.sid, req.body);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteService(req, res) {
  try {
    const result = await servicesService.deleteService(req.params.sid);
    res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
