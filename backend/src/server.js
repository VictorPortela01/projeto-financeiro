// 1. Importações (Libs)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db"); // Importa nossa função de conexão

// 1.1 Importação de Rotas
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
// 2. Configurações Iniciais
dotenv.config(); // Carrega as variáveis do .env para process.env
connectDB(); // Executa a função de conexão com o banco de dados
const app = express(); // Inicializa o Express

// 3. Middlewares (Recursos que rodam entre requisições)
app.use(cors()); // Permite que o frontend acesse esta API
app.use(express.json()); // Permite que o servidor entenda JSON
app.use(cookieParser()); // Permite que o servidor leia cookies (para o Refresh Token)

// 4. Rota de Teste (para ver se está funcionando)
app.get("/api/test", (req, res) => {
  res.send("API do Dashboard Financeiro está rodando!");
});

// 4.1 Usando rotas de autenticação
app.use("/api/auth", authRoutes);

// 4.2 USANDO AS ROTAS DE DADOS
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);

// 5. Inicialização do Servidor
const PORT = process.env.PORT || 5000; // Pega a porta do .env ou usa 5000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
