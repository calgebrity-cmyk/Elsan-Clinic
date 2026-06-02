import { apiClient } from "@/lib/axios";
import { LoginFormValues } from "@/schemas/auth.schema";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export class AuthService {
  static async login(payload: LoginFormValues): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", {
      email: payload.username,
      password: payload.password
    });
    return data;
  }
}
