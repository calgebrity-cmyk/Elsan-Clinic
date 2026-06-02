import { apiClient } from '@/lib/axios';

export interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
  doctorNotes?: string;
  nextVisitDate?: string;
  reminderNotes?: string;
}

export const VisitsService = {
  getAll: async (params?: { date?: string; doctor_id?: string; patient_id?: string }) => {
    const response = await apiClient.get<Visit[]>('/visits', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Visit>(`/visits/${id}`);
    return response.data;
  },

  create: async (data: Omit<Visit, 'id'>) => {
    const response = await apiClient.post<Visit>('/visits', data);
    return response.data;
  },
};
