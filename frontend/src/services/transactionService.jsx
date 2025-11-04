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
    throw error.res?.data || { success: false, message: "Erro de rede" };
  }
};

/**
 * Cria uma nova transação
 * @param {object} transactionData - { description, value, type, date, category}
 *
 */
export const createTransactionReq = async (transactionData) => {
  try {
    const res = await post("/transactions", transactionData);
    return res.data;
  } catch (error) {
    throw error.res?.data || { success: false, message: "Erro de rede" };
  }
};
