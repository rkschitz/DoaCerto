import api from './api';

export const listOrganizations = async () => {
    const response = await api.get('/api/v1/organization/');
    return response;
};

export const updateOrganization = async (id, organization) => {
    const response = await api.put(`/api/v1/organization/${id}`, organization);
    return response;
}

export const insertOrganization = async (organization) => {
    const response = await api.post('/api/v1/organization/', organization);
    return response;
}

export const deleteOrganization = async (id) => {
    const response = await api.delete(`/api/v1/organization/${id}`);
    return response;
}

