const asyncHandler = require('express-async-handler');
const userService = require('../services/userService');

class UserController {
  register = asyncHandler(async (req, res) => {
    const { user, token } = await userService.register(req.body);
    res.status(201).json({ user, token });
  });

  login = asyncHandler(async (req, res) => {
    const { cpf, password } = req.body;
    
    if (!cpf || !password) {
      res.status(400);
      throw new Error('CPF e senha são obrigatórios');
    }

    const { user, token } = await userService.login(cpf, password);
    res.json({ user, token });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      res.status(400);
      throw new Error('Email é obrigatório');
    }

    await userService.forgotPassword(email);
    res.json({ 
      message: 'Email de recuperação enviado com sucesso'
    });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400);
      throw new Error('Nova senha é obrigatória');
    }

    await userService.resetPassword(token, password);
    res.json({ 
      message: 'Senha alterada com sucesso'
    });
  });

  updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateUser(req.user.id, req.body);
    res.json(updatedUser);
  });

  // Novas funções admin
  getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
  });

  deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  });
}

module.exports = new UserController();