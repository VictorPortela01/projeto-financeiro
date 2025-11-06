const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} = require("../utils/tokenUtils");

const jwt = require("jsonwebtoken");

// Função de utilizdade para enviar a resposta(evita repetição)
const sendTokenResponse = async (res, user, statusCode) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  if (!Array.isArray(user.refreshTokens)) {
    user.refreshTokens = [];
  }

  // 1. Criar o hash no token
  const hashedToken = user.getHashedRefreshToken(refreshToken);
  // 2. Adiciona o hash no array do usuário no DB
  user.refreshTokens.push(hashedToken);

  user.markModified("refreshTokens");

  await user.save();

  sendRefreshToken(res, refreshToken); // Envia o refresh token no cookie

  // Envia o access token e os dados do usuário do corpo da resposta
  res.status(statusCode).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// @desc Registrar novo usuário
// @route POST /api/auth/register
// @access Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Por favor, forneça nome, e-mail e senha.",
      });
    }

    // 2. Verifica se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "E-mail já cadastrado." });
    }

    // 3. Cria o usuário (o hook 'pre-save' no Model User irá hashear a senha)
    const user = await User.create({ name, email, password });

    // 4. Envia a resposta com os tokens (login automático)
    await sendTokenResponse(res, user, 201); // 201 - Created
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login do usuário
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validação Básica
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Por favor, forneça e-mail e senha" });
    }

    // 2. Encontra o usuário
    // IMPORTANTE: Tivemos que usar .select('+password')
    // pois no Model User definimos 'select: false para a senha
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas." });
    }

    // 3. Compara a senha (Usando método que criamos no Model User)
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Credencias inválidas." });
    }

    // 4.Envia a resposta com os tokens
    await sendTokenResponse(res, user, 200); // 200 - OK
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Logout do usuário
// @route POST /api/auth/logout
// @access Private (idealmente, mas vamos deixar simples por enquanto)
exports.logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token && req.user) {
      const hashedToken = req.user.getHashedRefreshToken(token);

      // 1) remover token do DB
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { refreshTokens: hashedToken } }
      );
    }

    // 2) Limpar cookie (vamos padronizar o path para '/')
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ success: true, message: "Logout bem-sucedido." });
  } catch (error) {
    next(error);
  }
};

// @desc Refresh Access Token
// @route GET /api/auth/refresh
// @access Public (usa o cookie HttpOnly)
exports.handleRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token não encontrado." });
    }

    // 1. Verifica se o refresh token é válido
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 2. Busca o usuário no DB
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Usuário não encontrado." });
    }

    // 3. (SEGURANÇA EXTRA) Verifica se o hash do token está no array do usuário
    const hashedToken = user.getHashedRefreshToken(refreshToken);
    if (!user.refreshTokens.includes(hashedToken)) {
      return res
        .status(403) // 403 Forbidden - token roubado ou já invalidado
        .json({
          success: false,
          message: "Token inválido (possivelmente revogado).",
        });
    }

    // 4. Tudo certo. Gera um NOVO Access Token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    // Se o JWT falhar (expirado, malformado)
    return res
      .status(403)
      .json({ success: false, message: "Refresh token inválido ou expirado." });
  }
};
