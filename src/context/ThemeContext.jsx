// 導入必要的 React Hooks 和工具
import { createContext, useContext, useState, useMemo } from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { zhTW } from '@mui/material/locale';
import PropTypes from 'prop-types';

// 創建主題上下文
const ThemeContext = createContext(null);

/**
 * 主題提供者元件
 * 用於管理應用程式的主題設定（明亮/暗黑模式）
 * @param {Object} props - 元件屬性
 * @param {ReactNode} props.children - 子元件
 */
export const ThemeProvider = ({ children }) => {
  // 設定主題模式狀態，從本地存儲讀取或預設為明亮模式
  const [mode, setMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('themeMode');
      return savedMode || 'light';
    } catch (error) {
      console.error('從本地存儲讀取主題時發生錯誤:', error);
      return 'light';
    }
  });

  // 使用 useMemo 建立主題，避免不必要的重新渲染
  const theme = useMemo(() => {
    try {
      return createTheme(
        {
          palette: {
            mode,
            ...(mode === 'light'
              ? {
                  // 明亮模式顏色設定
                  primary: {
                    main: '#1976d2',
                  },
                  secondary: {
                    main: '#9c27b0',
                  },
                  background: {
                    default: '#f5f5f5',
                    paper: '#ffffff',
                  },
                }
              : {
                  // 暗黑模式顏色設定
                  primary: {
                    main: '#90caf9',
                  },
                  secondary: {
                    main: '#ce93d8',
                  },
                  background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                  },
                }),
          },
          // 設定字體
          typography: {
            fontFamily: ['Noto Sans TC', 'Roboto', 'sans-serif'].join(','),
          },
          // 元件樣式覆寫
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  textTransform: 'none',
                },
              },
            },
          },
        },
        zhTW,
      );
    } catch (error) {
      console.error('建立主題時發生錯誤:', error);
      // 返回基本備用主題
      return createTheme();
    }
  }, [mode]);

  /**
   * 切換主題模式的函數
   * 在明亮和暗黑模式之間切換
   */
  const toggleTheme = () => {
    try {
      const newMode = mode === 'light' ? 'dark' : 'light';
      setMode(newMode);
      localStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('切換主題時發生錯誤:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// 定義元件屬性型別
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * 自定義 Hook，用於在元件中使用主題上下文
 * @returns {Object} 包含主題模式和切換主題函數的物件
 * @throws {Error} 如果在 ThemeProvider 外使用則拋出錯誤
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme 必須在 ThemeProvider 內使用');
  }
  return context;
};
