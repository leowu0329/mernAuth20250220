import { createContext, useContext, useState, useMemo } from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { zhTW } from '@mui/material/locale';
import PropTypes from 'prop-types';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('themeMode');
      return savedMode || 'light';
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      return 'light';
    }
  });

  const theme = useMemo(() => {
    try {
      return createTheme(
        {
          palette: {
            mode,
            ...(mode === 'light'
              ? {
                  // Light mode colors
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
                  // Dark mode colors
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
          typography: {
            fontFamily: ['Noto Sans TC', 'Roboto', 'sans-serif'].join(','),
          },
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
      console.error('Error creating theme:', error);
      // Return a basic fallback theme
      return createTheme();
    }
  }, [mode]);

  const toggleTheme = () => {
    try {
      const newMode = mode === 'light' ? 'dark' : 'light';
      setMode(newMode);
      localStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
