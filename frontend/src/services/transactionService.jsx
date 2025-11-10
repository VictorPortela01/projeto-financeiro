import api from "./api";

/**
 * Busca todos as transações do usuário (com filtros).
 * (Nós ainda nãu usamos essa, mas vamos precisar em breve)
 */

export const getTransactionsReq = async () => {
  try {
    const res = await api.get("/transactions");
    return res.data;
  } catch (error) {
    throw error.response.data || { success: false, message: "Erro de rede" };
  }
};

/**
 * Cria uma nova transação
 * @param {object} transactionData - { description, value, type, date, category}
 *
 */
export const createTransactionReq = async (transactionData) => {
  try {
    const res = await api.post("/transactions", transactionData);
    return res.data;
  } catch (error) {
    throw error.response.data || { success: false, message: "Erro de rede" };
  }
};

/**
 * Atualiza uma transação já existente
 * @param {string} id
 * @param {object} transactionData
 */

export const updateTransactionReq = async ({ id, transactionData }) => {
  try {
    const res = await api.put(`/transactions/${id}`, transactionData);
    return res.data;
  } catch (error) {
    throw error.response.data || { success: false, message: "Erro de rede" };
  }
};

/**
 * Deleta uma transação
 * @param {string} id
 */

export const deleteTransactionReq = async (id) => {
  try {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data || { success: false, message: "Erro de rede" };
  }
};
