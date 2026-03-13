import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from storage on mount
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const stored = await AsyncStorage.getItem('favorite_brands');
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Failed to load favorites:', e);
            }
        };
        loadFavorites();
    }, []);

    // Save favorites whenever they change
    const saveFavorites = async (newFavs) => {
        try {
            await AsyncStorage.setItem('favorite_brands', JSON.stringify(newFavs));
        } catch (e) {
            console.error('Failed to save favorites:', e);
        }
    };

    const toggleFavorite = (productId) => {
        setFavorites(prev => {
            const isFav = prev.includes(productId);
            const next = isFav
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            saveFavorites(next);
            return next;
        });
    };

    const isFavorite = (productId) => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
