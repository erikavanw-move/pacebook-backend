import ServicesRepository from "../repositories/services.repository.js";

const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

class ServicesService {
  constructor() {
    this.repository = new ServicesRepository();
  }


  async getServices(filters = {}) {
    let services = await this.repository.getAll();
    const { category, available } = filters;

    if (category) {
      services = services.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (available !== undefined) {
      const isAvailable = available === "true";
      services = services.filter((s) => s.available === isAvailable);
    }

    return services;
  }

  async getServiceById(id) {
    const service = await this.repository.getById(id);
    return service || { error: `No existe un servicio con id ${id}` };
  }

  async createService(serviceData) {
    const missing = REQUIRED_FIELDS.filter(
      (field) => serviceData[field] === undefined
    );

    if (missing.length > 0) {
      return { error: `Faltan campos requeridos: ${missing.join(", ")}` };
    }

    return await this.repository.create({
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    });
  }

  async updateService(id, updatedData) {
    const existing = await this.repository.getById(id);

    if (!existing) {
      return { error: `No existe un servicio con id ${id}` };
    }

    const { id: _ignoredId, _id: _ignoredId2, ...safeData } = updatedData;

    return await this.repository.update(id, { ...existing, ...safeData });
  }

  async deleteService(id) {
    const deleted = await this.repository.delete(id);
    return deleted || { error: `No existe un servicio con id ${id}` };
  }
}

export default ServicesService;
