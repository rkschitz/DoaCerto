import api from './api';

export const loginOrganizacao = async (email, senha) => {
    const body = { email, senha };
    const response = await api.post('/api/v1/login', body, {
        headers: { 'Content-Type': 'application/json' },
    });
    return response;
};

export const buscarOrganizacoes = async () => {
    const response = await api.get('/api/v1/organizacao');
    return response;
}

export const editarOrganizacao = async (organizacao) => {
    const response = await api.put(`/api/v1/organizacao/${organizacao.idOrganizacao}`, organizacao);
    return response;
}

export const criarOrganizacao = async (organizacao) => {
    const response = await api.post('/api/v1/organizacao', organizacao);
    return response;
}

export const buscarAlimentosMovimentacao = async (ieMovimentacao) => {
    const response = await api.get('/api/v1/organizacao/alimentos_movimentacao', {
        params:{ ieMovimentacao}
    })
    return response;
}