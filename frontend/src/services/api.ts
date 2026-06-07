import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8009/api/v1';

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
  },
  getAssignedPatients: async () => {
    const response = await api.get('/patients/doctor/assigned');
    return response.data;
  },
  getPatient: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/patients/search?q=${query}`);
    return response.data;
  },
  getHistory: async (id: string) => {
    const response = await api.get(`/patients/${id}/history`);
    return response.data;
  }
};

export const appointmentApi = {
  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  }
};

export const visitApi = {
  create: async (data: any) => {
    const response = await api.post('/visits', data);
    return response.data;
  }
};

export const medicineApi = {
  search: async (query: string) => {
    const response = await api.get(`/medicines/search?q=${query}`);
    return response.data;
  },
  uploadCSV: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/medicines/upload-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export const prescriptionApi = {
  create: async (data: any) => {
    const response = await api.post('/prescriptions', data);
    return response.data;
  },
  generatePDF: async (id: string) => {
    const response = await api.post(`/prescriptions/${id}/regenerate-pdf`);
    return response.data;
  }
};

export const whatsappApi = {
  sendPrescription: async (prescriptionId: string) => {
    const response = await api.post('/whatsapp/send-prescription', { prescription_id: prescriptionId });
    return response.data;
  }
};
