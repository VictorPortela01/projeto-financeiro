const express = require("express");
const router = express.Router();

const { getSummary } = require("../controllers/dashboardController");

const {protect} = require('../middleware/authMiddleware') // Nosso segurança

// Aplicamos o 'protect' na rota
// GET /api/dashboard/summary
router.route('/summary').get(protect, getSummary);

module.exports = router;
