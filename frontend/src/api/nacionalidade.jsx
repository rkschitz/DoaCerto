import api from './api';

export const buscarTodosNacionalidade = async () => {
    const response = await api.get('/api/v1/nacionalidade')
    return response;
};