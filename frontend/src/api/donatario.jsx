import api from './api';

export const buscarDonatarios = async (paramBusca) => {
    const parametros = {
        nome: paramBusca.nome,
        cpf: paramBusca.cpf,
        situacaoCadastral: paramBusca.situacaoCadastral
    }
    const response = await api.get('/api/v1/donatario', {
        params: parametros
    })
    return response;
};

export const criarDonatario = async (donatario) => {
    const response = await api.post('/api/v1/donatario', donatario)
    return response;
}

export const editarDonatario = async (donatario) => {
    const response = await api.put(`/api/v1/donatario/${donatario.idDonatario}`, donatario)
    return response;
}

export const excluirDonatario = async (idDonatario) => {
    const response = await api.delete(`/api/v1/donatario/${idDonatario}`)
    return response;
}