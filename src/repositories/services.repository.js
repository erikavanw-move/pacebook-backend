import ServicesDAO from "../dao/services.dao.js";


class ServicesRepository {
  constructor() {
    this.dao = new ServicesDAO();
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async create(data) {
    return await this.dao.create(data);
  }

  async update(id, data) {
    return await this.dao.update(id, data);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}

export default ServicesRepository;
