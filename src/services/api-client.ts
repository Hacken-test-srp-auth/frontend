import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshAccessToken } from './auth';

const APIService = axios.create();

APIService.interceptors.request.use(
  async config => {
    config.baseURL = import.meta.env.VITE_API_BASE_URL;
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    console.log('====> :', config);
    return config;
  },
  error => Promise.reject(error)
);

APIService.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry: boolean;
    };
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }
        const { accessToken, refreshToken: newRefreshToken } =
          await refreshAccessToken(refreshToken);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return APIService(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        if (refreshError instanceof Error) {
          throw new Error(refreshError.message);
        } else {
          throw new Error('An unknown error occurred while refreshing token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export { APIService };
