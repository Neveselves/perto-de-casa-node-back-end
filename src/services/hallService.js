const Hall = require("../models/Hall");

class HallService {
  async getAllHalls() {
    return await Hall.find(
      {},
      {
        products: { $slice: 10 },
      }
    );
  }

  async getHallById(id) {
    return await Hall.findById(id);
  }

  async createHall(hallData) {
    return await Hall.create(hallData);
  }

  async updateHall(id, hallData) {
    return await Hall.findByIdAndUpdate(id, hallData, { new: true });
  }

  async deleteHall(id) {
    return await Hall.findByIdAndDelete(id);
  }
}

module.exports = new HallService();
