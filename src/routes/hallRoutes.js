const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', hallController.getAllHalls);
router.get('/:id', hallController.getHallById);

// Rotas protegidas - apenas admin
router.use(protect); // Aplica proteção em todas as rotas abaixo
router.post('/', restrictTo('admin'), hallController.createHall);
router.put('/:id', restrictTo('admin'), hallController.updateHall);
router.delete('/:id', restrictTo('admin'), hallController.deleteHall);

module.exports = router;