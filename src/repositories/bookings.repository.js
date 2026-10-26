import BookingsDAO from "../dao/bookings.dao.js";


class BookingsRepository {
  constructor() {
    this.dao = new BookingsDAO();
  }

  async create(data) {
    return await this.dao.create(data);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async update(id, data) {
    return await this.dao.update(id, data);
  }
}

export default BookingsRepository;
