import api from './api';

export const buscarTodosGrauParentesco = async () => {
    const response = await api.get('/api/v1/grauParentesco')
    return response;
};