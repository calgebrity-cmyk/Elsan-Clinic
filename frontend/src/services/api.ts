import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const doctorApi = {
  getDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  }
};

export const patientApi = {
  getPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  }
};

export const appointmentApi = {
  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  }
};
