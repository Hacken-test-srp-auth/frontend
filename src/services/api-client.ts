import axios from 'axios';

const APIService = axios.create();

APIService.interceptors.request.use(
  async (config) => {
    config.baseURL = import.meta.env.VITE_API_BASE_URL;
    config.headers.Authorization = `Bearer ${localStorage.getItem('assesToken')}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export { APIService };
