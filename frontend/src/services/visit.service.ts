import api from '../lib/axios';

export const visitService = {
  getAll: async () => {
    const response = await api.get('/visits');
    return response.data;
  },

  getByPatient: async (patientId: string) => {
    const response = await api.get(`/visits/patient/${patientId}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/visits/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/visits', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/visits/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/visits/${id}`);
    return response.data;
  }
};
