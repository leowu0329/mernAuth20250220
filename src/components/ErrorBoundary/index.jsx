import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // 這裡可以加入錯誤報告服務
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
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

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ErrorBoundary };
