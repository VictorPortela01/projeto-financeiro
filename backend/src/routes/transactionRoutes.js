const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");

// Aplicamos o 'protect' em todas as rotas
router
  .route("/")
  .post(protect, createTransaction)
  .get(protect, getTransactions);

// /api/transactions/:id
router
  .route("/:id")
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
