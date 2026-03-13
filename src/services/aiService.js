import api from '../config/api';

const aiService = {
    /**
     * Generate Virtual Try-On
     * @param {FormData} formData - Contains person_image, garment_image/garment_id
     */
    generateTryOn: async (formData) => {
        try {
            // Use longer timeout for AI operations (Hugging Face API can be slow)
            const response = await api.post('/api/tryon/generate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 1800000, // 30 minutes — CPU try-on can be very slow
            });
            return response.data;
        } catch (error) {
            console.error('Error generating try-on:', error);
            throw error;
        }
    },

    /**
     * Get Try-On Result
     */
    getTryOnResult: async (id) => {
        try {
            const response = await api.get(`/api/tryon/result/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching try-on result:', error);
            throw error;
        }
    },

    /**
     * Get Try-On History
     */
    getHistory: async (limit = 20, offset = 0) => {
        try {
            const response = await api.get(`/api/tryon/history?limit=${limit}&offset=${offset}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching history:', error);
            throw error;
        }
    },

    /**
     * Delete Try-On Result
     */
    deleteResult: async (id) => {
        try {
            const response = await api.delete(`/api/tryon/result/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting try-on result:', error);
            throw error;
        }
    },

    /**
     * Check Style (AI Style Check)
     */
    checkStyle: async (itemId) => {
        try {
            const response = await api.post('/api/ai/style-check', { itemId });
            return response.data;
        } catch (error) {
            console.error('Error analyzing style:', error);
            throw error;
        }
    },

    /**
     * Suggest Outfits
     */
    suggestOutfit: async (occasion = 'casual', season = 'all') => {
        try {
            const response = await api.post('/api/ai/suggest-outfit', { occasion, season });
            return response.data;
        } catch (error) {
            console.error('Error suggesting outfit:', error);
            throw error;
        }
    }
};

export default aiService;
