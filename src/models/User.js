const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
    },
    cpf: {
      type: String,
      required: [true, "CPF é obrigatório"],
      unique: true,
      validate: {
        validator: function (cpf) {
          return /^\d{11}$/.test(cpf);
        },
        message: "CPF inválido",
      },
    },
    phone: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      validate: {
        validator: function (phone) {
          return /^\d{10,11}$/.test(phone);
        },
        message: "Telefone inválido",
      },
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email inválido"],
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    address: {
      cep: {
        type: String,
        required: [true, "CEP é obrigatório"],
        validate: {
          validator: function (cep) {
            return /^\d{8}$/.test(cep);
          },
          message: "CEP inválido",
        },
      },
      street: {
        type: String,
        required: [true, "Rua é obrigatória"],
      },
      number: {
        type: String,
        required: [true, "Número é obrigatório"],
      },
      neighborhood: {
        type: String,
        required: [true, "Bairro é obrigatório"],
      },
      city: {
        type: String,
        required: [true, "Cidade é obrigatória"],
      },
      state: {
        type: String,
        required: [true, "Estado é obrigatório"],
        default: "PE",
      },
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
