import api from './api'

// ** 
// @param {string} email
// @param {string} password
// @returns {Promise<object>} {success, accessToken, user}
// */

export const loginReq = async(email, password) => {
    try {
        const res = await api.post('/auth/login', {email, password});
        return res.data
    } catch (error) {
        throw error.response?.data || {success: false, message: "Erro de rede"};
    }
}

// **
// @param {string} name
// @param {string} email
// @param {string} password
// @returns {Promise<object>} {success, accessToken, user}
// */

export const registerReq = async (name, email, password) => {
    try {
        const res = await api.post("/auth/register", {name, email, password});
        return res.data 
    } catch (error) {
        throw error.response?.data || {success :false, message: "Erro de rede"};
    }
}

// /** 
// Envia uma requisição de logout para a API
// (O AccessToken é enviado elo Intercetor, o RefreshToken pelo cookie) 
// */

export const logoutReq = async () => {
    try {
        const res = await api.post('/auth/logout');
        return res.data
    } catch (error) {
        throw error.response?.data || {success: false, message: 'Erro de rede'}
    }
}


/* 
    Envia uma requisição para obter um novo Access Token.
    (Usa o cookie httpOnly 'refreshToken')
    @returns {Promise<object>} {success, accessToken}
*/

export const refreshReq = async () => {
    try {
        const res = await api.get('/auth/refresh')
        return res.data
    } catch (error) {
        throw error.response?.data || {success: false, message: "Erro de rede"}
    }
}