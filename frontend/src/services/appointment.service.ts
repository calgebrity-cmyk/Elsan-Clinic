import api from '../lib/axios';
import type { AppointmentApiResponse } from '../types/appointment.types';

export const appointmentService = {
  getAll: async (): Promise<AppointmentApiResponse[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getById: async (id: string): Promise<AppointmentApiResponse> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (data: Partial<AppointmentApiResponse>) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  update: async (id: string, data: Partial<AppointmentApiResponse>) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  assignDoctor: async (id: string, doctorId: string) => {
    const response = await api.put(`/appointments/${id}/assign-doctor`, { doctor_id: doctorId });
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  },
};
