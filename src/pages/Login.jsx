// 導入必要的 React Hook 和路由元件
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// 導入 Material-UI 元件
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
// 導入 Material Icons
import { Visibility, VisibilityOff } from '@mui/icons-material';
// 導入身份驗證相關 Hook
import { useAuth } from '../context/AuthContext.jsx';
// 導入提示訊息元件
import { toast } from 'react-toastify';

/**
 * 登入頁面元件
 * 提供使用者登入功能，包含電子郵件和密碼輸入
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 表單資料狀態
  const [formData, setFormData] = useState({
    email: 'ryowu0329@gmail.com',
    password: 'leo140814',
  });

  // 控制密碼顯示狀態
  const [showPassword, setShowPassword] = useState(false);
  // 載入狀態
  const [loading, setLoading] = useState(false);

  // 處理表單輸入變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      // 檢查用戶是否已驗證郵箱
      if (result.user.isVerified) {
        toast.success('登入成功！');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.log('Login error:', error);
      // 處理未驗證郵箱的情況
      if (
        error.status === 'UNVERIFIED' ||
        error.response?.data?.message === '請先驗證您的郵箱'
      ) {
        const email = error.email || formData.email;
        console.log('Redirecting to verify-email with email:', email);
        toast.info('請先驗證您的郵箱後再登入');
        navigate('/verify-email', {
          state: { email },
          replace: true,
        });
        return; // 提前返回，不顯示登入失敗的錯誤訊息
      }
      toast.error(error.response?.data?.message || '登入失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          {/* 頁面標題 */}
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            登入
          </Typography>
          {/* 登入表單 */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* 電子郵件輸入框 */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="電子郵件"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            {/* 密碼輸入框 */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密碼"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* 登入按鈕 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '登入中...' : '登入'}
            </Button>
            {/* 忘記密碼和註冊連結 */}
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
              >
                忘記密碼？
              </Link>
              <Box sx={{ mt: 1 }}>
                <Link component={RouterLink} to="/register" variant="body2">
                  還沒有帳號？註冊
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
