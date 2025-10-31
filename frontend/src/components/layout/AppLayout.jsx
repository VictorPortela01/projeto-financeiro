import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const {user, logout} = useAuth();

    return (
        <header className='sticky top-0 z-10 bg-white shadow-md dark:bg-gray-800'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>

                    {/* Logo ou Título */}
                    <div className='shrink-0'>
                        <h1 className='text-xl font-bold text-indigo-600 dark:text-indigo-400'>MeuFinanceiro</h1>
                    </div>

                    {/* Nome do Usuário e Logout */}
                    <div className='flex items-center'>
                        <span className='hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block'>
                            Olá, {user?.name.split(' ')[0]}
                        </span>
                        <button onClick={logout}
                            title='Sair'
                            aria-label='Sair'
                            className='ml-4 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'>
                                <FaSignOutAlt className='h-5 w-5'/>
                        </button>

                    </div>

                </div>
            </div>
        </header>
    );
};

const AppLayout = () => {
    return(
        <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
            <Navbar />
            <main>
                {/* As páginas serão renderizadas aqui */}
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout;