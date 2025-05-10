import api from './api';

export const buscarPessoaPorNome = async (nome, cpf) => {
    const response = await api.get('/api/v1/pessoa/buscar',
        { params: { nome, cpf } });
    return response;
}

export const criar = async (pessoa) => {
    const response = await api.post('/api/v1/pessoa', pessoa);
    return response;
}

export const editarPessoa = async (pessoa) => {
    const response = await api.put(`/api/v1/pessoa/${pessoa.idPessoa}`, pessoa);
    return response;
}

export const deletarPessoa = async (idPessoa) => {
    const response = await api.delete(`/api/v1/pessoa/${idPessoa}`);
    return response;
}

export const buscarTodasPessoas = async () => {
    const response = await api.get('/api/v1/pessoa');
    return response;
}