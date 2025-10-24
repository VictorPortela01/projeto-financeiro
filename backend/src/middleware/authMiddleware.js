const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // 1. Verifica se o "Authorization" header existe e começa com "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extrai o token (Remove "Bearer" da string)
      token = req.headers.authorization.split(" ")[1];

      // 3. Verifica se o token é valido (usando o Access Token Secret)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Busca o usuário no banco de dados pelo ID (sem a senha)
      // e anexa o usuário ao objeto 'req'
      req.user = await User.findById(decoded.userId).select("-password");

      // 5. Se o usuário não for encontrado (ex: token válido, mas usuário deletado)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuário não encontrado",
        });
      }

      // 6. Continua para a próxima função (o controller da rota)
      next();
    } catch (error) {
      // Trata erros de token (expirado, inválido)
      console.error(error);
      return res
        .status(401)
        .json({ success: false, message: "Não inválido ou expirado" });
    }
  }
  // 7. Se não houver "Authorization" header
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Não autorizado. Nenhum token." });
  }
};
