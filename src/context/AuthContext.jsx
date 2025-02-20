// 導入必要的 React Hooks 和工具
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import PropTypes from 'prop-types';

// 創建身份驗證上下文
const AuthContext = createContext(null);

// 身份驗證提供者元件
export const AuthProvider = ({ children }) => {
  // 狀態管理：用戶資訊、載入狀態和錯誤訊息
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 元件掛載時檢查身份驗證狀態
  useEffect(() => {
    // 檢查本地存儲的 token
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  // 檢查用戶身份驗證狀態
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error('身份驗證檢查失敗:', error);
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

  // 用戶註冊函數
  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      // 註冊後不再設置 token 和 user，因為需要先驗證郵箱
      if (!response.data || !response.data.user) {
        throw new Error('註冊回應格式錯誤');
      }
      return response.data;
    } catch (error) {
      console.error('註冊失敗:', error);
      setError(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // 用戶登入函數
  const login = async (email, password) => {
    if (!email || !password) {
      setError('需要提供電子郵件和密碼');
      throw new Error('需要提供電子郵件和密碼');
    }
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // 檢查用戶是否已驗證
      if (!user.isVerified) {
        const error = new Error('請先驗證您的郵箱');
        error.status = 'UNVERIFIED';
        error.email = user.email;
        throw error;
      }

      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('登入失敗:', error);
      // 檢查是否是後端返回的未驗證錯誤
      if (error.response?.data?.status === 'UNVERIFIED') {
        const customError = new Error('請先驗證您的郵箱');
        customError.status = 'UNVERIFIED';
        customError.email = error.response.data.email;
        throw customError;
      }
      setError(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // 用戶登出函數
  const logout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('登出失敗:', error);
      setError('登出失敗: ' + error.message);
    }
  };

  // 提供給上下文的值
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    checkAuth,
  };

  // 渲染身份驗證提供者
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 定義 PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 自定義 Hook 用於存取身份驗證上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內使用');
  }
  return context;
};
