import React, { createContext, useState, useEffect, useContext } from 'react';
import { logout as apiLogout } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'theme-dark' : 'theme-light';
  }, [isDarkMode]);

  useEffect(() => {
    const savedUser = localStorage.getItem('becs_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await apiLogout(); // Calls the backend to clear the HttpOnly cookie and session
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('becs_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, isDarkMode, setIsDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
