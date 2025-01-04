const nodemailer = require("nodemailer");

class EmailService {
  constructor() {}

  async sendPasswordReset(email, resetToken) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const resetURL = `${process.env.FRONTEND_URL}login/novasenha/${resetToken}`;

    const message = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Recuperação de Senha (válido por 10 minutos)",
      html: `
        <p>Você solicitou a recuperação de senha.</p>
        <p>Clique no link abaixo para definir uma nova senha:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      `,
    };

    await transporter.sendMail(message);
  }
}

module.exports = new EmailService();
