const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "A descrição é obrigatória"],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, "O valor é obrigatório."],
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"], // Validação: Só permite os dois
    },
    date: {
      type: Date,
      required: [true, "A data é obrigatória."],
      default: Date.now(),
    },
    user: {
      // Link para o usuário dono da transação
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "A categoria é obrigatória."],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
