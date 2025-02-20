// 導入必要的 React Hook 和路由元件
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 導入 Material-UI 元件
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
// 導入提示訊息元件
import { toast } from 'react-toastify';
// 導入身份驗證相關 Hook
import { useAuth } from '../context/AuthContext.jsx'; // 修改擴展名

// 忘記密碼頁面元件
const ForgotPassword = () => {
  const navigate = useNavigate();
  // 載入狀態
  const [loading, setLoading] = useState(false);
  // 電子郵件輸入狀態
  const [email, setEmail] = useState('');
  // 錯誤訊息狀態
  const [error, setError] = useState('');
  // 表單提交狀態
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 驗證電子郵件格式
  const validateEmail = () => {
    if (!email) {
      setError('請輸入電子郵件');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('請輸入有效的電子郵件');
      return false;
    }
    return true;
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setLoading(true);
    try {
      // 發送重設密碼請求
      const response = await fetch(
        'http://localhost:5000/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '發送重設密碼郵件失敗');
      }

      setIsSubmitted(true);
      toast.success('重設密碼郵件已發送，請查收您的信箱');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 顯示郵件發送成功畫面
  if (isSubmitted) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom>
              郵件已發送！
            </Typography>
            <Typography color="text.secondary" paragraph>
              我們已將重設密碼的連結發送至：
              <br />
              <strong>{email}</strong>
            </Typography>
            <Typography color="text.secondary" paragraph>
              請查收您的信箱並點擊郵件中的連結重設密碼。
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              返回登入
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  // 顯示忘記密碼表單
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            忘記密碼
          </Typography>

          <Typography color="text.secondary" align="center" paragraph>
            請輸入您的電子郵件，我們將發送重設密碼的連結給您。
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="電子郵件"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  error={!!error}
                  helperText={error}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    '發送重設密碼郵件'
                  )}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography align="center">
                  想起密碼了？ <Link to="/login">返回登入</Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
