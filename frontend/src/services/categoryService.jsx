import api from './api';

/**
 * Busca todos as categorias do usuário logado.
 * @returns {Promise<object>} A lista de categorias.
 */

export const getCategoriesReq = async () => {
    try {
        const res = await get('/categories');
        return res.data // Retorna {success: true, count: X, data: [...] }
    } catch (error) {
        throw error.response?.data || {success: false, message: "Erro de rede"};
    }
};

// (Vamos adcionar createCategory, updateCategory, etc. aqui mais tarde)