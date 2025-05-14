import api from './api';

export const buscarTodosSituacaoProfissional = async () => {
    const response = await api.get('/api/v1/situacaoProfissional')
    return response;
};