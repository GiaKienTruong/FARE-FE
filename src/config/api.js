// src/config/api.js
// API configuration và axios setup

import axios from 'axios';
import { getAuth } from 'firebase/auth';

// API Base URL
// Khi test trên điện thoại thật, thay bằng IP máy tính
// Ví dụ: http://192.168.1.100:3000
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Emulator/Simulator
  : 'https://your-production-api.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm Firebase token vào mọi request
api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized - có thể logout user
        console.log('Unauthorized - please login again');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;