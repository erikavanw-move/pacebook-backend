import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "data", "bookings.json");

class BookingsDAO {
  async #read() {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  }

  async #write(items) {
    await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2));
  }

  async create(data) {
    const items = await this.#read();
    const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const { id: _ignored, ...rest } = data;
    const newItem = { id: nextId, ...rest };

    items.push(newItem);
    await this.#write(items);
    return newItem;
  }

  async getById(id) {
    const items = await this.#read();
    return items.find((item) => item.id === Number(id)) || null;
  }

  // Reemplaza el registro completo; devuelve null si no existe
  async update(id, data) {
    const items = await this.#read();
    const index = items.findIndex((item) => item.id === Number(id));
    if (index === -1) return null;

    const { id: _ignored, ...rest } = data;
    items[index] = { id: items[index].id, ...rest };

    await this.#write(items);
    return items[index];
  }
}

export default BookingsDAO;
