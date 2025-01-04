const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.patch('/reset-password/:token', userController.resetPassword);

// Rotas protegidas
router.use(protect);
router.patch('/update', userController.updateUser);

// Rotas admin
router.get('/all-users', restrictTo('admin'), userController.getAllUsers);
router.delete('/delete-user/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router;