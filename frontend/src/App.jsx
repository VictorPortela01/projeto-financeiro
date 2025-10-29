import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* <Navbar /> */} {/* (Exemplo de onde o Navbar ficará) */}
      <main>
        {/* Outlet é onde o React Router renderizará a página atual */}
        <Outlet />
      </main>


      {/* <Footer /> */} {/* (Exemplo de onde o Footer ficará)  */}
    </div>
  );
};

export default App;
