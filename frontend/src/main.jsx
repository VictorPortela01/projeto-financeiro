import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// 1. IMPORTAÇÕES DO REACT QUERY
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App.jsx";
import "./index.css";

// Importação das nossas páginas
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

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
    path: "/", // Rota Raiz
    element: <App />, //  Renderiza o Layout Raiz (App.jsx)
    // Children são as páginas que serão renderizadas DENTRO do <Outlet /> do App.jsx
    children: [
      {
        index:  true  , // Rota: http://localhost:5173/
        element: <DashboardPage />,
      },
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
]);

// 3 ATUALIZAÇÃO DO RENDER
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ENVOLVENDO A APLICAÇÃO COM O PROVIDER */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
