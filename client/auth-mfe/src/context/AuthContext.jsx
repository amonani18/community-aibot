import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        console.log('Token valid, user:', data.data.me);
        setUser(data.data.me);
        window.dispatchEvent(new Event('auth-changed'));
        return true;
      } else {
        console.log('Invalid token response:', data);
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth-changed'));
        return false;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      
      // For demo purposes, fallback to test mode if backend is unavailable
      console.log('Backend error, using test mode');
      setUser({
        id: 'test123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'resident'
      });
      return true;
      
      // Uncomment below in production:
      // localStorage.removeItem('token');
      // window.dispatchEvent(new Event('auth-changed'));
      // return false;
    }
  };

  // Only run this effect once when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('Found token in localStorage, verifying...');
        const isValid = await verifyToken(token);
        
        if (!isValid) {
          console.log('Token verification failed');
        }
      } else {
        console.log('No token found in localStorage');
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []); // Empty dependency array to run only once

  const login = (token, userData) => {
    console.log('Login called with user:', userData);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    // Clear any redirect flags
    sessionStorage.removeItem('redirectAttempted');
    
    // Notify the container that auth state has changed
    window.dispatchEvent(new Event('auth-changed'));
    
    // Use a small timeout to ensure the token is saved before redirecting
    setTimeout(() => {
      console.log('Redirecting to community page...');
      window.location.href = '/community';
    }, 100);
  };

  const logout = () => {
    console.log('Logout called');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    sessionStorage.removeItem('redirectAttempted');
    setUser(null);
    
    // Notify the container that auth state has changed
    window.dispatchEvent(new Event('auth-changed'));
    
    navigate('../login');
  };

  if (loading) {
    return <div className="text-center p-3">Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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