import { apiClient } from "@/lib/axios";
import { DoctorFormValues } from "@/schemas/doctor.schema";

export interface DoctorResponse {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  consultation_timings: string;
  signature_url: string | null;
  status: boolean;
  is_active: boolean;
}

export class DoctorsService {
  static async getAll(): Promise<DoctorResponse[]> {
    const { data } = await apiClient.get<DoctorResponse[]>("/doctors");
    return data;
  }

  static async getById(id: string): Promise<DoctorResponse> {
    const { data } = await apiClient.get<DoctorResponse>(`/doctors/${id}`);
    return data;
  }

  static async create(payload: DoctorFormValues): Promise<DoctorResponse> {
    const { data } = await apiClient.post<DoctorResponse>("/doctors", payload);
    return data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/doctors/${id}`);
  }
}
