const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");

// Aplicamos o middleware 'protect' em TODAS as rotas de categoria
// Ninguém pode acessar /api/categories sem um token válido

// Rotas para /api/categories/
router.route("/").post(protect, createCategory).get(protect, getCategories);

// Rotas para /api/categories/:id
router
  .route("/:id")
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);


module.exports = router