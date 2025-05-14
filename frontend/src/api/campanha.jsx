import api from './api';

export const buscarCampanhas = async (idOrganizacao, ativos) => {
    const response = await api.get('/api/v1/campanha', {
        params: { idOrganizacao: idOrganizacao || null, ativos: ativos }
    })
    return response;
}

