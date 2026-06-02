import { apiClient } from '@/lib/axios';

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  doctor: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export const AppointmentsService = {
  getAll: async (params?: { date?: string; doctor_id?: string; status?: string }) => {
    const response = await apiClient.get<Appointment[]>('/appointments', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  create: async (data: Omit<Appointment, 'id' | 'status'>) => {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  },

  updateStatus: async (id: string, status: Appointment['status']) => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status });
    return response.data;
  },
};
