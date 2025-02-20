// 導入必要的 React Hook
import { useContext } from 'react';
// 導入語言上下文
import { LanguageContext } from '../context/LanguageContext';

/**
 * 語言設定 Hook
 * 用於獲取和使用語言上下文中的狀態與方法
 * @returns {Object} 語言上下文物件，包含當前語言設定和切換語言的方法
 * @throws {Error} 如果在 LanguageProvider 外使用此 Hook 會拋出錯誤
 */
export const useLanguage = () => {
  // 獲取語言上下文
  const context = useContext(LanguageContext);
  // 確保 Hook 在 LanguageProvider 內使用
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
