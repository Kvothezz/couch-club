import axios from 'axios';
import { ENV } from '../config/env';
const api = axios.create({
  baseURL: ENV.API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('couch_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;