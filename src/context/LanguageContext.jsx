import { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import zhTW from '../locales/zh-TW.json';
import enUS from '../locales/en-US.json';
import PropTypes from 'prop-types';

// 創建並導出 context
export const LanguageContext = createContext(null);

// 導出可用的語言消息
export const messages = {
  'zh-TW': zhTW,
  'en-US': enUS,
};

export const LanguageProvider = ({ children }) => {
  // Get initial locale from localStorage or default to zh-TW
  const [locale, setLocale] = useState('zh-TW'); // Default value while loading

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('language');
      if (savedLocale && messages[savedLocale]) {
        setLocale(savedLocale);
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
      // Keep default zh-TW if there's an error
    }
  }, []);

  const changeLanguage = (newLocale) => {
    try {
      // Validate that the new locale exists in messages
      if (!messages[newLocale]) {
        console.error(`Invalid locale: ${newLocale}`);
        return;
      }
      setLocale(newLocale);
      localStorage.setItem('language', newLocale);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale="zh-TW"
        onError={(err) => {
          console.error('IntlProvider error:', err);
          // Log more details about the error
          if (err.code) {
            console.error('Error code:', err.code);
          }
          if (err.message) {
            console.error('Error message:', err.message);
          }
        }}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 導出 useLanguage hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
