const asyncHandler = require('express-async-handler');
const hallService = require('../services/hallService');

class HallController {
  getAllHalls = asyncHandler(async (req, res) => {
    const halls = await hallService.getAllHalls();
    res.json(halls);
  });

  getHallById = asyncHandler(async (req, res) => {
    const hall = await hallService.getHallById(req.params.id);
    if (!hall) {
      res.status(404);
      throw new Error('Hall not found');
    }
    res.json(hall);
  });

  createHall = asyncHandler(async (req, res) => {
    const hall = await hallService.createHall(req.body);
    res.status(201).json(hall);
  });

  updateHall = asyncHandler(async (req, res) => {
    const hall = await hallService.updateHall(req.params.id, req.body);
    if (!hall) {
      res.status(404);
      throw new Error('Hall not found');
    }
    res.json(hall);
  });

  deleteHall = asyncHandler(async (req, res) => {
    const hall = await hallService.deleteHall(req.params.id);
    if (!hall) {
      res.status(404);
      throw new Error('Hall not found');
    }
    res.status(204).send();
  });
}

module.exports = new HallController();