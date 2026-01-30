// src/services/wardrobeService.js
// API calls cho Wardrobe features

import api from '../config/api';

export const wardrobeService = {
  // Lấy tất cả items
  async getItems(category = null) {
    try {
      const url = category 
        ? `/api/wardrobe/items?category=${category}`
        : '/api/wardrobe/items';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy item theo ID
  async getItemById(itemId) {
    try {
      const response = await api.get(`/api/wardrobe/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload item mới
  async uploadItem(formData) {
    try {
      const response = await api.post('/api/wardrobe/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update item
  async updateItem(itemId, data) {
    try {
      const response = await api.put(`/api/wardrobe/items/${itemId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa item
  async deleteItem(itemId) {
    try {
      const response = await api.delete(`/api/wardrobe/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy stats
  async getStats() {
    try {
      const response = await api.get('/api/wardrobe/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Toggle favorite
  async toggleFavorite(itemId, currentFavorite) {
    try {
      const response = await api.put(`/api/wardrobe/items/${itemId}`, {
        favorite: !currentFavorite,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};