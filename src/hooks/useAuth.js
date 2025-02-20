// 導入必要的 React Hook
import { useContext } from 'react';
// 導入身份驗證上下文
import { AuthContext } from '../context/AuthContext';

/**
 * 身份驗證 Hook
 * 用於獲取和使用身份驗證上下文中的狀態與方法
 * @returns {Object} 身份驗證上下文物件，包含用戶狀態和相關方法
 * @throws {Error} 如果在 AuthProvider 外使用此 Hook 會拋出錯誤
 */
export const useAuth = () => {
  // 獲取身份驗證上下文
  const context = useContext(AuthContext);
  // 確保 Hook 在 AuthProvider 內使用
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
