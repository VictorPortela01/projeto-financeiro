import { createContext, useState,useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    loginReq,
    registerReq,
    logoutReq,
    refreshReq
} from '../services/authService'

import api  from '../services/api'

// 1. Criação do Contexto 
const AuthContext = createContext()

// 2. Criação do Provide (Provider)
export const AuthProvider = ({ children }) =>{
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true ) // Começa true (carregando)
    const navigate = useNavigate()

    // --- Funções de Ação ---
    const login = async(email, password) => {
        try {
            const data = await loginReq(email, password);
            setUser(data.user)
            setAccessToken(data.accessToken);
            // Salva o usuário no localStorage para persisênca básica
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/') // Redireciona para o Dashboard
            return data
        } catch (error) {
            console.error("Falha ao login:", error);
            throw error; // Lança o erro para o formulário de login tratar
        }
    };

    const register = async(name, email, password) => {
        try {
            const data = await registerReq(name, email, password);
            setUser(data.user);
            setAccessToken(data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate('/')
            return data;
        } catch (error) {
            console.error("Falha ao registrar", error);
            throw error;
            
        }
    };

    // Usamos useCallback para evitar recriação desnecessária
    const logout = useCallback(async () => {
        try {
            await logoutReq()
        } catch (error) {
            console.error("Erro no logout (API): ", error);
        } finally {
            // Limpa o estado e o localStorage independente de erro na API
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem('user');
            navigate("/login");
        }
    }, [navigate]);

    // --- Efeito de Persistência (Ao carregar o App) ---
    useEffect(() => {
        // Esta função é o coração do "manter logado"
        const initializeAuth = async () => {
            const storedUser = localStorage.getItem("user");

            try {
                if(storedUser) {
                    // 1. Se tem usuário no localStorage, confia nele (temporariamente)
                    setUser(JSON.parse(storedUser))

                    // 2. Tenta pegar um novo Access Token usando o Refresh Token 
                    const data = await refreshReq()
                    setAccessToken(data.accessToken)
                }
            } catch (error) {
                // 3. Se o refresh falhar (ex: token expirado, servidor offline)
                console.error("Sessão expirada. Por favor, faça login");
                // Limpa qualquer dado inválido 
                setUser(null);
                setAccessToken(null);
                localStorage.removeItem("user");
            } finally {
                // 4. Termina o carregamento
                setIsLoading(false);
            }
        };

        initializeAuth()
    }, [])

    // --- Configuração dos Interceptors do Axios ---
    // (Este é o Passo 3.7, mas faz sentido colocar aqui)

    useEffect(() => {
        // Interceptor de Requisições (Req Interceptor)
        // "Porteiro" que adiciona o token em CADA requisição
        const reqInterceptor = api.interceptors.request.use(
            (config) => {
                if(accessToken) {
                    config.headers['Authorization'] = `Bearer ${data.accessToken}`; 
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Interceptor de Resposta (Response Interceptor)
        // Lida com "Access Token Expirado (Erro 401)"
        const resInterceptor = api.interceptors.response.use(
            (res) => res, // Se a resposta for OK (2xx), não faz nada
            async(error) => {
                const originalReq = error.config;
            
                // Se o erro for 401 E não for a rota a refresh (evita loop)
                if(error.response?.status === 401 && !originalReq._retry) {
                    originalReq._retry = true; // Marca como "tentado"

                    try {
                        // Tenta pegar um novo Access Token
                        const data = await refreshReq();
                        setAccessToken(data.accessToken);

                        // Atualiza o header da requisição original com o novo token
                        originalReq.headers['Authorization'] = `Bearer ${data.accessToken}`;

                        // Tenta a requisição original novamente
                        return api(originalReq);

                    } catch (refreshError) {
                        // Se o refresh falhar, desloga o usuário
                        console.error("Error ao renovar token:" , refreshError);
                        logout() // Chama a funtion logout
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
    }, [accessToken, logout]) // Roda de novo se o accessToken ou o logout mudarem

    // 3. o valor que o Contexto vai fornecer
    const value = {
        user, 
        accessToken,
        isLoading,
        login,
        register,
        logout,

    };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}
