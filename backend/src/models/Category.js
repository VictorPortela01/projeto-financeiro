const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome da categoria é obrigatória."],
      trim: true,
      lowercase: true,
    },
    user: {
      // Este é o "Link" (Foreign Key) para o Model "User"
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // A coleção que estamos referenciando
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
