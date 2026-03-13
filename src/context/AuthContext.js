// src/context/AuthContext.js
// Authentication context và state management

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase'; // Import auth đã init sẵn

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          // Import API dynamically to avoid circular dependencies if any
          const api = require('../config/api').default;
          
          // Call sync endpoint to ensure user exists in our DB
          console.log('🔄 Syncing user with backend...');
          const response = await api.post('/api/auth/sync');
          
          // Combine Firebase user with DB profile info
          setUser({
            ...currentUser,
            dbId: response.data.user.id,
            subscriptionTier: response.data.user.subscription_tier
          });
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
          // If sync fails (e.g. backend down), we still set the firebase user
          // but might have issues with data-dependent features
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};