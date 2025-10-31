import { Outlet } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';


const App = () => {
  const { isLoading } = useAuth();

  if(isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold">Carregando App...</h1>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Outlet é onde o React Router renderizará a página atual */}
        <Outlet />
    </div>
  );
};

export default App;
