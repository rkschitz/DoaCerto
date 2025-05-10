import api from './api';

export const buscarTodos = async () => {
    const response = await api.get('/api/v1/situacaoProfissional')
    return response;
};