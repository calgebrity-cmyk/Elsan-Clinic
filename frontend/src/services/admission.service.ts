import { api } from './api';

export const admissionService = {
  getAll: async () => {
    const response = await api.get('/admissions');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/admissions', data);
    return response.data;
  },

  discharge: async (id: string) => {
    const response = await api.put(`/admissions/${id}/discharge`);
    return response.data;
  },

  addDailyVisit: async (admissionId: string, data: any) => {
    const response = await api.post(`/admissions/${admissionId}/daily-visits`, data);
    return response.data;
  }
};
