const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const emailService = require("./emailService");

class UserService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async register(userData) {
    const user = await User.create(userData);
    const token = this.generateToken(user._id);

    user.password = undefined;
    return { user, token };
  }

  async login(cpf, password) {
    const user = await User.findOne({ cpf }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("CPF ou senha incorretos");
    }

    const token = this.generateToken(user._id);
    user.password = undefined;

    return { user, token };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Não existe usuário com este email");
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await emailService.sendPasswordReset(user.email, resetToken);
      return true;
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new Error("Erro ao enviar email. Tente novamente mais tarde.");
    }
  }

  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token inválido ou expirado");
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    return true;
  }

  async updateUser(userId, updateData) {
    // Não permite atualizar role através desta função
    delete updateData.role;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }

  // Funções admin
  async getAllUsers() {
    return await User.find().select("-password");
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return true;
  }
}

module.exports = new UserService();
