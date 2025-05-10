import api from './api';

export const buscarTodosUnidadeMedida = async () => {
    const response = await api.get('/api/v1/unidade_medida')
    return response;
};