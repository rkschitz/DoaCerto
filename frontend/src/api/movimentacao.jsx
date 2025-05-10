import api from './api';

export const buscarMovimentacoes = async () => {
    const response = await api.get('/api/v1/movimentacao')
    return response;
};

export const criarMovimentacao = async (movimentacao) => {
    const response = await api.post('/api/v1/movimentacao', movimentacao);
    return response;
}

export const editarMovimentacao = async (movimentacao) => {
    const response = await api.put(`/api/v1/movimentacao/${movimentacao.idMovimentacao}`, movimentacao);
    return response;
}