// 導入必要的 React Hooks 和工具
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

// 身份驗證提供者元件
export const AuthProvider = ({ children }) => {
  // 狀態管理：用戶資訊和載入狀態
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 元件掛載時檢查本地存儲的用戶資訊
  useEffect(() => {
    try {
      // 檢查本地存儲是否有用戶資料
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('從本地存儲載入用戶資料時發生錯誤:', error);
      // 清除可能損壞的資料
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // 用戶登入函數
  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const userData = response.data;
    try {
      // 設置用戶狀態並保存到本地存儲
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('保存用戶資料時發生錯誤:', error);
      throw new Error('保存用戶資料失敗');
    }
    return userData;
  };

  // 用戶登出函數
  const logout = () => {
    try {
      // 清除用戶狀態和本地存儲
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('登出時發生錯誤:', error);
    }
  };

  // 提供身份驗證上下文給子元件
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 定義元件屬性型別
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
