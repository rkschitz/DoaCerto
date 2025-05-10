import api from './api';

export const buscarDonatariosAtivos = async (nome,cpf) => {
    const response = await api.get('/api/v1/donatario',{
        params: {nome,cpf}
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