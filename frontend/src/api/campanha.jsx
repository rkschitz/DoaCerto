import api from './api';

export const buscarCampanhas = async (params) => {
    const response = await api.get('/api/v1/campanha', { params })
    return response;
}

export const editarCampanha = async (campanha) => {
    const response = await api.put(`/api/v1/campanha/${campanha.idCampanha}`, campanha);
    return response;
}

export const criarCampanha = async (campanha) => {
    const response = await api.post('/api/v1/campanha', campanha);
    return response;
}