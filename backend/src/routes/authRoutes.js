const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

// Mapeia a rota POST /api/auth/register para a função registerUser
router.post("/register", registerUser);

// Mapeia a rota POST /api/auth/login para a função loginUser
router.post("/login", loginUser);

// Mapeia a rota POST /api/auth/logout para a função logoutUser
router.post("/logout", logoutUser);

module.exports = router;
