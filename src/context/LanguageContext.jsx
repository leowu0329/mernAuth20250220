// 導入必要的 React Hooks 和工具
import { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
// 導入語言包
import zhTW from '../locales/zh-TW.json';
import enUS from '../locales/en-US.json';
import PropTypes from 'prop-types';

// 創建並導出語言上下文
export const LanguageContext = createContext(null);

// 導出可用的語言消息包
export const messages = {
  'zh-TW': zhTW,
  'en-US': enUS,
};

// 語言提供者元件
export const LanguageProvider = ({ children }) => {
  // 從 localStorage 獲取初始語言設定，預設為繁體中文
  const [locale, setLocale] = useState('zh-TW'); // 載入時的預設值

  // 元件掛載時檢查本地存儲的語言設定
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('language');
      if (savedLocale && messages[savedLocale]) {
        setLocale(savedLocale);
      }
    } catch (error) {
      console.error('從 localStorage 載入語言設定時發生錯誤:', error);
      // 發生錯誤時保持預設的繁體中文
    }
  }, []);

  // 切換語言的函數
  const changeLanguage = (newLocale) => {
    try {
      // 驗證新語言設定是否存在於消息包中
      if (!messages[newLocale]) {
        console.error(`無效的語言設定: ${newLocale}`);
        return;
      }
      setLocale(newLocale);
      localStorage.setItem('language', newLocale);
    } catch (error) {
      console.error('儲存語言偏好設定時發生錯誤:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale="zh-TW"
        onError={(err) => {
          console.error('IntlProvider 錯誤:', err);
          // 記錄更多錯誤詳情
          if (err.code) {
            console.error('錯誤代碼:', err.code);
          }
          if (err.message) {
            console.error('錯誤訊息:', err.message);
          }
        }}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

// 定義 PropTypes
LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 導出 useLanguage hook
// 用於在其他元件中存取語言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage 必須在 LanguageProvider 內使用');
  }
  return context;
};
