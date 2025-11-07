const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
} = require("../controllers/authController");
// Importar nosso novo middleware
const { protect } = require("../middleware/authMiddleware");

// Rotas públicas
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);

// Rotas protegidas (precissam de Access Token)
router.post("/logout", protect, logoutUser)



module.exports = router;
