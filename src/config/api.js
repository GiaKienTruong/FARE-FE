// src/config/api.js
// API configuration và axios setup

import axios from 'axios';
import { auth } from './firebase'; // Import từ firebase.js thay vì getAuth

// API Base URL
// Use dynamic IP for Expo Go on physical device

const getBaseUrl = () => {
  // Replace with your actual Render/Cloud URL after deployment
  // For example: 'https://fare-be.onrender.com'
  const productionUrl = 'https://YOUR_BACKEND_URL.onrender.com';
  
  if (__DEV__) {
    return 'http://192.168.9.112:3000';
  }
  return productionUrl;
};

export const API_BASE_URL = getBaseUrl();
console.log('🔗 [API URL]:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1800000, // 30 minutes for long AI operations
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