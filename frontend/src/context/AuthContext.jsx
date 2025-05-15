import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

// Helper to decode JWT (without validation, for role extraction)
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const signup = async (formData) => {
    const res = await axios.post('/auth/signup', formData);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setRole('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  // useEffect to update role from token and sync to localStorage
  useEffect(() => {
    if (token) {
      const payload = parseJwt(token);
      const userRole = payload.role || (user && user.role) || '';
      setRole(userRole);
      localStorage.setItem('role', userRole);
    } else {
      setRole('');
      localStorage.removeItem('role');
    }
  }, [token, user]);

  const isAdmin = role === 'admin';
  const isWasherman = role === 'washerman';
  const isUser = role === 'user';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      role,
      isAdmin,
      isWasherman,
      isUser,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);