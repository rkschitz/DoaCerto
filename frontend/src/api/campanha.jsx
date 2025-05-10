import api from './api';

export const buscarCampanhasAtivas = async () => {
    const response = await api.get('/api/v1/campanha/ativas')
    return response;
}

