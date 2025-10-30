import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = () => {
    const {user, isLoading} = useAuth()

    // 1. Se o AuthContext ainda está "Carregando" (Verificnaod o refresh token)
    //  Mostrando um loading. Isso é crucial para evitar que um usuáio 
    //  logado que seja "jogado" para o /login por um instante

    if(isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <h1 className="font-bold text-3xl">
                Carregando...
                </h1>
            </div>
        )
    }
    /**
     * 2. Se não está carregando E o usuário EXISTE (esta logado)
     *  Rendereiza o <Outlet />, que é a "Página filha" (ex; Dashboard)
     */
    if(!isLoading && user) {
        return <Outlet />
    }

    /**
     * Se NÃO está carregando E o usuário NÃO EXISTE (não está logado)
     *  Redireciona para a página de login
     */

    return <Navigate to="/login" replace/>


}


export default PrivateRoute;