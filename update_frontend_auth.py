import os

axios_content = """import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // IMPORTANT: Allows sending and receiving HTTPOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token. 
        // The refresh endpoint will read the refresh_token HTTPOnly cookie and set a new access_token cookie.
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // If refresh fails, we must redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
"""

auth_service_content = """import api from '../lib/axios';
import { LoginFormData } from '../schemas';

export const authService = {
  login: async (email: string, password: string) => {
    // We send the login request. The backend will respond with HTTPOnly cookies automatically.
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    // Tell backend to blacklist the token and clear the cookies
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error("Logout failed on server, but proceeding locally", e);
    }
  },

  getMe: async () => {
    // This request will automatically include the access_token cookie
    const response = await api.get('/auth/me');
    return response.data;
  },
};
"""

def update_files():
    with open('frontend/src/lib/axios.ts', 'w') as f:
        f.write(axios_content)
    with open('frontend/src/services/auth.service.ts', 'w') as f:
        f.write(auth_service_content)

if __name__ == "__main__":
    update_files()
    print("Frontend auth updated for HTTPOnly cookies")
