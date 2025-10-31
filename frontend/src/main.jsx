import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from './components/layout/AppLayout.jsx'
// 1. IMPORTAÇÕES DO REACT QUERY
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext.jsx";

import App from "./App.jsx";
import "./index.css";

// Importação das nossas páginas
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

// Auth Wrappers (Nossos novos componentes)
import PrivateRoute from "./components/auth/PrivateRoute.jsx";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute.jsx";

// 2. cRIAÇÃO DO CLIENTE
// o QueryClient é o "cérebro" do React Query

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configurações globais (opcional, mas bom)
      staleTime: 1000 * 60 * 5, // 5 minutos (quanto tempo o cache é considerado "novo")
      refetchOnWindowFocus: false, // Não recarrega dados só por trocar de aba
      retry: 1, // Tenta refazer a query 1 vez em caso de falha
    },
  },
});

// 1. Criação do Roteador
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // Children são as páginas que serão renderizadas DENTRO do <Outlet /> do App.jsx
    children: [
      // --- Rota Privadas (protegidas) ---
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/",
                element: <DashboardPage />,
              },
            ],
          },
        ],
      },

      // --- Rota Públicas (Apenas para não logados) ---
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: "/login", // Rota: http://localhost:5173/login
            element: <LoginPage />,
          },
          {
            path: "/register", // // Rota: http://localhost:5173/register
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
]);

// 3 ATUALIZAÇÃO DO RENDER
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
