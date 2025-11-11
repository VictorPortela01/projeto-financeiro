import axios from "axios";

// 1. Define a URL base da nossa API
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // (A porta do backend)

// 2. Cria a instância do Axios
const api = axios.create({
  baseURL: BASE_URL,
});

// 3. IMPORTANTE: Configuraçao para enviar cookies (nosso Refresh Token)
// em requisições cross-origin (ex: localhost:5173 -> localhost:5000)
api.defaults.withCredentials = true;

// 4. (O PRÓXIMO PASSO) - Interceptors
// Mais tarde, vamos adicionar "interceptors" aqui.
// Eles são "porteiros" que irão interceptar TODAS as requisições.
// - O Interceptor de Request: Vai adicionar o Access Token no header.
// - O Interceptor de Response: Vai lidar com o erro 401 (token expirado)
// e tentar usar o /api/auth/refresh para pegar um novo token

export default api;
