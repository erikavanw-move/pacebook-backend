import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "..", "data", "services.json");

const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

class ServiceManager {
  // Persistencia interna (asíncrona)

  async #readServices() {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  }

  async #writeServices(services) {
    await fs.writeFile(DATA_PATH, JSON.stringify(services, null, 2));
  }

  #generateId(services) {
    return services.length > 0
      ? Math.max(...services.map((s) => s.id)) + 1
      : 1;
  }

  // API pública

  async getServices() {
    return await this.#readServices();
  }

  async getServiceById(id) {
    const services = await this.#readServices();
    const service = services.find((s) => s.id === Number(id));
    return service || { error: `No existe un servicio con id ${id}` };
  }

  async addService(serviceData) {
    const missing = REQUIRED_FIELDS.filter(
      (field) => serviceData[field] === undefined
    );

    if (missing.length > 0) {
      return { error: `Faltan campos requeridos: ${missing.join(", ")}` };
    }

    const services = await this.#readServices();

    const newService = {
      id: this.#generateId(services),
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    };

    services.push(newService);
    await this.#writeServices(services);
    return newService;
  }

  async updateService(id, updatedData) {
    const services = await this.#readServices();
    const index = services.findIndex((s) => s.id === Number(id));

    if (index === -1) {
      return { error: `No existe un servicio con id ${id}` };
    }

    const { id: _ignoredId, ...safeData } = updatedData;

    services[index] = { ...services[index], ...safeData };
    await this.#writeServices(services);
    return services[index];
  }

  async deleteService(id) {
    const services = await this.#readServices();
    const index = services.findIndex((s) => s.id === Number(id));

    if (index === -1) {
      return { error: `No existe un servicio con id ${id}` };
    }

    const [deleted] = services.splice(index, 1);
    await this.#writeServices(services);
    return deleted;
  }
}

export default ServiceManager;
