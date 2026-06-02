import { apiClient } from "@/lib/axios";
import { StaffFormValues } from "@/schemas/staff.schema";

export interface StaffResponse {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export class StaffService {
  static async getAll(): Promise<StaffResponse[]> {
    const { data } = await apiClient.get<StaffResponse[]>("/staff");
    return data;
  }

  static async getById(id: string): Promise<StaffResponse> {
    const { data } = await apiClient.get<StaffResponse>(`/staff/${id}`);
    return data;
  }

  static async create(payload: StaffFormValues): Promise<StaffResponse> {
    const { data } = await apiClient.post<StaffResponse>("/staff", payload);
    return data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/staff/${id}`);
  }
}
