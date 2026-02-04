// src/config/api.js
// API configuration và axios setup

import axios from 'axios';
import { auth } from './firebase'; // Import từ firebase.js thay vì getAuth

// API Base URL
// Android Emulator: dùng 10.0.2.2
// iOS Simulator: dùng localhost
// Điện thoại thật: dùng IP máy tính
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000'  // Android Emulator
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
      console.error('API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        console.log('Unauthorized - please login again');
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;