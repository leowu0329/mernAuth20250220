// 導入必要的 React Hooks 和工具
import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { LanguageContext, messages } from './LanguageContext.jsx';

/**
 * 語言提供者元件
 * 用於管理應用程式的語言設定和國際化
 * @param {Object} props - 元件屬性
 * @param {ReactNode} props.children - 子元件
 */
export const LanguageProvider = ({ children }) => {
  // 設定語言狀態，預設為繁體中文
  const [locale, setLocale] = useState('zh-TW');

  /**
   * 切換語言的函數
   * @param {string} newLocale - 新的語言代碼
   */
  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    // 將語言偏好儲存到本地存儲
    localStorage.setItem('language', newLocale);
  };

  return (
    // 提供語言上下文給子元件
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {/* 使用 react-intl 的 Provider 包裝子元件 */}
      <IntlProvider
        messages={messages[locale]} // 當前語言的翻譯訊息
        locale={locale} // 當前語言設定
        defaultLocale="zh-TW" // 預設語言為繁體中文
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

// 定義元件屬性型別
LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
