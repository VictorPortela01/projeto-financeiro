import api from "./api";

/**
 * Busca todos as categorias do usuário logado.
 * @returns {Promise<object>} A lista de categorias.
 */

export const getCategoriesReq = async () => {
  try {
    const res = await api.get("/categories");
    return res.data; // Retorna {success: true, count: X, data: [...] }
  } catch (error) {
    throw error.response?.data || { success: false, message: "Erro de rede" };
  }
};

/**
 * Cria uma nova categoria
 * @param {string} name
 */

export const createCategoryReq = async (name) => {
  try {
    const res = await api.post("/categories", { name });
    return res.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Erro de rede" };
  }
};

/**
 * Atualiza uma categoria existente.
 * @param {string} id
 * @param {string} name
 */

export const updateCategoryReq = async ({ id, name }) => {
  try {
    const res = await api.put(`/categories/${id}`, { name });
    return res.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Erro de rede" };
  }
};


/**
 * 
 * Deleta uma categoria
 * @param {string} id
 */

export const deleteCategoryReq = async (id) => {
  try {
    const res = await api.delete(`/categories/${id}`)
  } catch (error) {
    throw error.response?.data || {success: false, message: "Erro de rede"};
  }
};