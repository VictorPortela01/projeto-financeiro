import api from './api';

/**
 * Busca os dados de resumo (saldos, categorias) da API.
 * @returns {Promise<object>}
 */

export const getSummaryReq = async() => {
    try {
        const res = await api.get('/dashboard/summary');
        return res.data; // Retorna {success: true, message: {totalIncome, ....}}
    } catch (error) {
        throw error.response?.data || {success: false, message: "Erro de rede"};
    }
}