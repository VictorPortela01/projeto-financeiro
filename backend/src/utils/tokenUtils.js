const jwt = require("jsonwebtoken");

// Gera o Access Token (Curta duração)
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Gera o Refresh Token (Longa duração)
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_LIFETIME,
  });
};

// Envia o RefreshToken como um Cookie HttpOnly
const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true, // Imprede acesso via JavaScript (segurança contra XSS)
    secure: process.env.NODE_ENV === "production", // Use 'true' em produção (HTTPS)
    sameSite: "strict", // Proteção conta CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias (mesmo tempo do token)
    path: '/',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
};
