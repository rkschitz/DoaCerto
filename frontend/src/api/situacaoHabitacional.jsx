import api from './api';

export const buscarTodosSituacaoHabitacional = async () => {
    const response = await api.get('/api/v1/situacaoHabitacional')
    return response;
};