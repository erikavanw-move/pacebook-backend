import { Router } from "express";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();
const serviceManager = new ServiceManager();

// GET /api/services — acepta filtros opcionales por query params
router.get("/", (req, res) => {
  let servicios = serviceManager.getServices();
  const { category, available } = req.query;

  if (category) {
    servicios = servicios.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (available !== undefined) {
    const disponible = available === "true";
    servicios = servicios.filter((s) => s.available === disponible);
  }

  res.status(200).json(servicios);
});

// GET /api/services/:sid
router.get("/:sid", (req, res) => {
  const resultado = serviceManager.getServiceById(req.params.sid);
  const status = resultado.error ? 404 : 200;
  res.status(status).json(resultado);
});

// POST /api/services
router.post("/", (req, res) => {
  const resultado = serviceManager.addService(req.body);
  const status = resultado.error ? 400 : 201;
  res.status(status).json(resultado);
});

// PUT /api/services/:sid
router.put("/:sid", (req, res) => {
  const resultado = serviceManager.updateService(req.params.sid, req.body);
  const status = resultado.error ? 404 : 200;
  res.status(status).json(resultado);
});

// DELETE /api/services/:sid
router.delete("/:sid", (req, res) => {
  const resultado = serviceManager.deleteService(req.params.sid);
  const status = resultado.error ? 404 : 200;
  res.status(status).json(resultado);
});

export default router;
