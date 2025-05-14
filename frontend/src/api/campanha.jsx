import api from './api';

export const buscarCampanhas = async (idOrganizacao, ativos) => {
    const response = await api.get('/api/v1/campanha', {
        params: { idOrganizacao: idOrganizacao, ativos: ativos }
    })
    return response;
}

export const editarCampanha = async (campanha) => {
    const body = {
        idCampanha: campanha.idCampanha,
        titulo: campanha.titulo,
        descricao: campanha.descricao,
        ieSituacao: campanha.ieSituacao,
        metas: campanha.metas
    }

    const response = await api.put(`/api/v1/campanha/${campanha.idCampanha}`, body);
    return response;
}

export const criarCampanha = async (campanha) => {
    const response = await api.post('/api/v1/campanha', campanha);
    return response;
}