import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isMicrofrontend = window.location.pathname.includes('/auth');

  const verifyToken = async (token) => {
    console.log('Verifying token...');
    
    // For testing purposes - bypass verification for test token
    if (token === 'test-token-123') {
      console.log('Using test token, bypassing verification');
      setUser({
        id: 'test123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'resident'
      });
      return true;
    }
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query {
              me {
                id
                username
                email
                role
              }
            }
          `
        })
      });

      const data = await response.json();
      console.log('Token verification response:', data);

      if (data.data?.me) {
        setUser(data.data.me);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const isValid = await verifyToken(token);
      if (!isValid) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleNavigation = (path) => {
    if (isMicrofrontend) {
      // In microfrontend mode, use window.location
      window.location.href = path;
    } else {
      // In standalone mode, use React Router navigation
      try {
        navigate(path);
      } catch (error) {
        console.warn('Navigation error:', error);
        window.location.href = path;
      }
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    handleNavigation('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    handleNavigation('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 