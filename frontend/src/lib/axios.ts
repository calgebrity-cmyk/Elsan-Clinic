import axios from 'axios';
import { getApiBaseUrl } from './api-config';

const API_BASE_URL = getApiBaseUrl();
console.log("Axios API_BASE_URL is:", API_BASE_URL);

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
          const path = window.location.pathname;
          let redirectUrl = '/login';
          if (path.includes('admin')) {
            redirectUrl = '/elsanclinic/admin-login';
          } else if (path.includes('staff')) {
            redirectUrl = '/elsanclinic/staff-login';
          } else if (path.includes('doctor')) {
            redirectUrl = '/elsanclinic/doctor-login';
          }
          window.location.href = redirectUrl;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.message === 'Network Error') {
      console.error("AXIOS NETWORK ERROR URL:", originalRequest?.url, "BASE URL:", originalRequest?.baseURL);
      if (typeof window !== 'undefined') {
        alert("Network Error when reaching: " + (originalRequest?.baseURL || "") + (originalRequest?.url || ""));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
