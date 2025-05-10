import api from './api';

export const personLogin = async (email, password) => {
    const body = { email, password };
    const response = await api.post('/api/v1/login', body, {
        headers: { 'Content-Type': 'application/json' },
    });
    return response;
};

export const registerPerson = async (data) => {
    const response = await api.post('/api/v1/register/', data, {
        headers: { 'Content-Type': 'application/json' },
    });
    return response;
};

export const insertPerson = async (data) => {
    const response = await api.post('/api/v1/person/', data);
    return response;
}

export const listPersons = async () => {
    const response = await api.get('/api/v1/person/');
    return response;
};

export const updatePerson = async (id, person) => {
    const response = await api.put(`/api/v1/person/${id}`, person);
    return response;
  };

export const deletePerson = async (id) => {
    const response = await api.delete(`/api/v1/person/${id}`);
    return response;
}
