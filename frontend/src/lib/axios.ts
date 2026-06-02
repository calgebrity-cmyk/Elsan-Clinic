import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // With HTTP-only cookies, we don't need to manually attach an Authorization header.
    // The browser automatically sends the secure cookie.
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If 401 Unauthorized, attempt token refresh (assuming backend has a /refresh endpoint that reads the refresh cookie)
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out user (redirect to login)
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
