import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  });

  const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/jwt/refresh/', {
        refresh: refreshToken
      });
  
      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);

      localStorage.setItem('isAuthenticated', 'true');
      return newAccessToken;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const login = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    const decoded = jwtDecode(accessToken);
    setUser(decoded);
    setIsAuthenticated(true);

    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('isAuthenticated');
  };

  const checkAuth = async () => {
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          setIsAuthenticated(false);
          return;
        }
  
        try {
          const decodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
  
          if (decodedToken.exp < currentTime) {
            // Пробуем обновить токен
            await refreshAuthToken();
          }
          setIsAuthenticated(true);

          localStorage.setItem('isAuthenticated', 'true');
          setUser(decodedToken);
          
        } catch (error) {
          console.error('Authentication error:', error);
          setIsAuthenticated(false);

          localStorage.removeItem('isAuthenticated');
        }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  //}, [isAuthenticated]);
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);