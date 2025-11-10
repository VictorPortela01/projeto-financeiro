/**
 * Formata um númeor para a moeda BRL (Real Brasileiro.)
 * @param {number} value - O valor a ser formatado.
 * @returns {string} - o valor formatado como 'R$ 1.050,00.
 */

export const formatCurrency = (value) => {
    if(value === undefined || value === null) {
        return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

/**
 * Formata uma string de data (ISO) para o formato 'dd/mm/aaaa'
 * @param {string} dateString 
 * @returns {string}
 */

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        timeZone: "UTC",
    });
};