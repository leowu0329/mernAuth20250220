import { createContext } from 'react';

// Import language files
import zhTW from '../locales/zh-TW.json';
import enUS from '../locales/en-US.json';

export const LanguageContext = createContext(null);

export const messages = {
  'zh-TW': zhTW,
  'en-US': enUS,
};
