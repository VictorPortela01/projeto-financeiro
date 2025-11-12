import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  loginReq,
  registerReq,
  logoutReq,
  refreshReq,
} from "../services/authService";

import api from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

// 1. Criação do Contexto
const AuthContext = createContext();

// 2. Criação do Provide (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Começa true (carregando)
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    // Limpa o header de autorização padrão do Axios
    delete api.defaults.headers.common["Authorization"];

    queryClient.clear();

    navigate("/login");
  }, [navigate, queryClient]);

  // --- Funções de Ação ---
  const login = async (email, password) => {
    try {
      const data = await loginReq(email, password);
      setUser(data.user);
      setAccessToken(data.accessToken);
      // Salva o usuário no localStorage para persisênca básica
      localStorage.setItem("user", JSON.stringify(data.user));
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;
      navigate("/");
      return data;
    } catch (error) {
      console.error("Falha ao login:", error);
      throw error; // Lança o erro para o formulário de login tratar
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await registerReq(name, email, password);
      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;
      navigate("/");
      return data;
    } catch (error) {
      console.error("Falha ao registrar", error);
      throw error;
    }
  };

  // Usamos useCallback para evitar recriação desnecessária
  const logout = useCallback(async () => {
    try {
      await logoutReq();
    } catch (error) {
      console.error("Erro no logout (API): ", error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  // --- Efeito de Persistência (Ao carregar o App) ---
  useEffect(() => {
    // Esta função é o coração do "manter logado"
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");

      try {
        if (storedUser) {
          // 1. Se tem usuário no localStorage, confia nele (temporariamente)
          setUser(JSON.parse(storedUser));

          // 2. Tenta pegar um novo Access Token usando o Refresh Token
          const data = await refreshReq();
          setAccessToken(data.accessToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
        }
      } catch (error) {
        // 3. Se o refresh falhar (ex: token expirado, servidor offline)
        console.error("Sessão expirada.");
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, [clearAuth]);

  // --- Configuração dos Interceptors do Axios ---

  useEffect(() => {
    // Interceptor de Requisições (Req Interceptor)
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de Resposta (Response Interceptor)
    const resInterceptor = api.interceptors.response.use(
      (res) => res, // Se a resposta for OK (2xx), não faz nada
      async (error) => {
        const originalReq = error.config;

        // A. Se a rota de REFRESH falhar (401), é o fim do jogo.
        if (
          error.response?.status === 401 &&
          originalReq.url.endsWith("/auth/refresh")
        ) {
          console.error("Refresh token inválido. Deslogando.");
          clearAuth(); // <-- USA A FUNÇÃO SEGURA
          return Promise.reject(error);
        }

        // B. Se qualquer OUTRA rota falhar com 401, tenta renovar o token
        if (error.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true

            try {
                const data = await refreshReq();
                setAccessToken(data.accessToken);
                // Atualiza o header padrão para futuras req
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
                // Atualiza o header da req original que falhou
                originalReq.headers['Authorization'] = `Bearer ${data.accessToken}`

                return api(originalReq);
            } catch (error) {
                // C. Se a TENTATIVA de refresh falhar
                console.error("Erro ao renovar token", refreshError);
                clearAuth();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
      }
    );

    // Função de "limpeza" (Quando o componente desmonta)
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [clearAuth]); // Roda de novo se o accessToken ou o logout mudarem

  // 3. o valor que o Contexto vai fornecer
  const value = {
    user,
    accessToken,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
