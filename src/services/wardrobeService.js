import api from '../config/api';

const wardrobeService = {
  /**
   * Get all wardrobe items
   * @param {string} category - Optional category filter
   * @param {boolean} favorite - Optional favorite filter
   */
  getItems: async (category = null, favorite = false) => {
    try {
      let url = '/api/wardrobe/items';
      const params = [];
      if (category) params.push(`category=${category}`);
      if (favorite) params.push(`favorite=true`);

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
      throw error;
    }
  },

  /**
   * Get single item by ID
   */
  getItemById: async (id) => {
    try {
      const response = await api.get(`/api/wardrobe/items/${id}`);
      return response.data.item;
    } catch (error) {
      console.error('Error fetching item details:', error);
      throw error;
    }
  },

  /**
   * Upload new item to wardrobe
   * @param {Object} formData - FormData containing 'image' and item details
   */
  addItem: async (formData) => {
    try {
      const response = await api.post('/api/wardrobe/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding wardrobe item:', error);
      throw error;
    }
  },

  /**
   * Update existing item
   */
  updateItem: async (id, data) => {
    try {
      const response = await api.put(`/api/wardrobe/items/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  /**
   * Delete item
   */
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/api/wardrobe/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  /**
   * Get wardrobe statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/api/wardrobe/stats');
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

export default wardrobeService;