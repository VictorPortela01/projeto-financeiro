import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PublicOnlyRoute = () => {
  const { user, isLoading } = useAuth();

  // 1. Loading para evitar piscar a tela errada
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Carregando...</h1>
      </div>
    );
  }

  // 2. Se o usuário NÃO estiver logado → pode acessar páginas públicas
  if (!user) {
    return <Outlet />;
  }

  // 3. Se o usuário estiver logado → redireciona pro dashboard
  return <Navigate to="/" replace />;
};

export default PublicOnlyRoute;
