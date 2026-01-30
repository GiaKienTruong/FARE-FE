// src/utils/testAPI.js
// Utility để test kết nối backend

import api from '../config/api';

/**
 * Test backend health endpoint
 */
export async function testBackendConnection() {
  try {
    console.log('🔍 Testing backend connection...');
    const response = await api.get('/health');
    console.log('✅ Backend connected successfully!', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure backend is running: npm run dev');
    }
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test wardrobe API
 */
export async function testWardrobeAPI() {
  try {
    console.log('🔍 Testing wardrobe API...');
    const response = await api.get('/api/wardrobe/items');
    console.log('✅ Wardrobe API works!', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Wardrobe API failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test user profile API
 */
export async function testProfileAPI() {
  try {
    console.log('🔍 Testing profile API...');
    const response = await api.get('/api/auth/profile');
    console.log('✅ Profile API works!', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Profile API failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Run all API tests
 */
export async function runAllTests() {
  console.log('🧪 Running all API tests...');
  
  const results = {
    health: await testBackendConnection(),
    wardrobe: await testWardrobeAPI(),
    profile: await testProfileAPI()
  };
  
  console.log('📊 Test Results:', results);
  return results;
}