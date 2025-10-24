const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor, informe seu nome."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Por favor, informe seu e-mail."],
      unique: true, // Garante que email seja único
      lowercase: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: "Por favor, use um formato de e-mail válido.",
      },
    },
    password: {
      type: String,
      required: [true, "Por favor, informe sua senha."],
      minlength: 6,
      select: false, // Não inclui a senha por padrão
    },
    
    refreshTokens: [String], // Vamos armazenar os hashes dos tokens aqui
  },
  {
    // Adiciona os campos "createdAt" e "updatedAt"
    timestamps: true,
  }
);
// Middleware que roda antes do save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Gera o 'sal'
  this.password = await bcrypt.hash(this.password, salt); // Faz o hash
  next();
});

// Método para comparar a senha informada no login com a senha do banco
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
