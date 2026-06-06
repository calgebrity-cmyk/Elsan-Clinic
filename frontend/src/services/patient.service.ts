import api from '../lib/axios';
import type { PatientApiResponse } from '../types/patient.types';

export const patientService = {
  getAll: async (): Promise<PatientApiResponse[]> => {
    const response = await api.get('/patients');
    return response.data;
  },

  getById: async (id: string): Promise<PatientApiResponse> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (data: Partial<PatientApiResponse>) => {
    const response = await api.post('/patients', data);
    return response.data;
  },

  update: async (id: string, data: Partial<PatientApiResponse>) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  search: async (query: string): Promise<PatientApiResponse[]> => {
    const response = await api.get(`/patients/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  }
};
