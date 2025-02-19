import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { LanguageContext, messages } from './LanguageContext.jsx';

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('zh-TW');

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale="zh-TW"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
