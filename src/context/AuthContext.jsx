import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 檢查本地存儲的 token
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Auth check failed:', error);
      // 只有在非 404 錯誤時才顯示錯誤信息
      if (error.response?.status !== 404) {
        setError(error.response?.data?.message || error.message);
      }
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response data');
      }
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      setError('Email and password are required');
      throw new Error('Email and password are required');
    }
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // 檢查用戶是否已驗證
      if (!user.isVerified) {
        setError('請先驗證郵箱');
        const error = new Error('請先驗證郵箱');
        error.status = 'UNVERIFIED';
        error.email = user.email;
        throw error;
      }

      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      // 檢查是否是後端返回的未驗證錯誤
      if (error.response?.data?.message === '請先驗證郵箱') {
        const customError = new Error('請先驗證郵箱');
        customError.status = 'UNVERIFIED';
        customError.email = error.response.data.email; // 假設後端返回了 email
        throw customError;
      }
      setError(error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout: ' + error.message);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
