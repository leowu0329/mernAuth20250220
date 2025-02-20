// 導入必要的 React 和 Material-UI 元件
import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * 錯誤邊界元件
 * 用於捕獲子元件中的 JavaScript 錯誤，並顯示備用 UI
 */
class ErrorBoundary extends React.Component {
  // 初始化元件狀態
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * 當子元件拋出錯誤時觸發
   * 用於更新元件狀態，顯示錯誤 UI
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * 捕獲並記錄錯誤和錯誤堆疊
   * @param {Error} error - 錯誤物件
   * @param {Object} errorInfo - 包含元件堆疊的錯誤資訊
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // 記錄錯誤到控制台
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  /**
   * 處理重置操作
   * 清除錯誤狀態並重新導向到首頁
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  /**
   * 渲染元件
   * 如果有錯誤則顯示錯誤 UI，否則渲染子元件
   */
  render() {
    if (this.state.hasError) {
      // 錯誤發生時顯示的備用 UI
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 3,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
              }}
            >
              <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                糟糕！出現了一些問題
              </Typography>
              <Typography color="text.secondary" paragraph>
                應用程式發生了意外錯誤，我們已記錄此問題。
              </Typography>
              <Button
                variant="contained"
                onClick={this.handleReset}
                sx={{ mt: 2 }}
              >
                返回首頁
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    // 正常情況下渲染子元件
    return this.props.children;
  }
}

// 定義元件屬性型別
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
