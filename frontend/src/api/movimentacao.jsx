import api from './api';

export const buscarMovimentacoes = async (param) => {
    const response = await api.get('/api/v1/movimentacao', {
        params: param
    })
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

export const excluirMovimentacao = async (idMovimentacao) => {
    const response = await api.delete(`/api/v1/movimentacao/${idMovimentacao}`);
    return response;
}

export const excluirMovimentacaoAlimento = async (idMovimentacaoAlimento) => {
    const response = await api.delete(`/api/v1/movimentacao/excluir_alimento/${idMovimentacaoAlimento}`);
    return response;
}