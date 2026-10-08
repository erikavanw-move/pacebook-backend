import ServiceManager from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();

export async function getServices(req, res) {
  try {
    let servicios = await serviceManager.getServices();
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
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getServiceById(req, res) {
  try {
    const resultado = await serviceManager.getServiceById(req.params.sid);
    const status = resultado.error ? 404 : 200;
    res.status(status).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createService(req, res) {
  try {
    const resultado = await serviceManager.addService(req.body);
    const status = resultado.error ? 400 : 201;
    res.status(status).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateService(req, res) {
  try {
    const resultado = await serviceManager.updateService(req.params.sid, req.body);
    const status = resultado.error ? 404 : 200;
    res.status(status).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteService(req, res) {
  try {
    const resultado = await serviceManager.deleteService(req.params.sid);
    const status = resultado.error ? 404 : 200;
    res.status(status).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
