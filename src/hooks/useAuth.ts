// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data.user);
    } catch (e) {
      localStorage.removeItem('authToken'); // Token inválido, lo removemos
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al registrarse');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error("Error en el logout del backend, pero se procederá con el logout local.");
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  return { user, loading, error, login, register, logout };
};