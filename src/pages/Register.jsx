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
 * 註冊頁面元件
 * 提供使用者註冊功能，包含姓名、電子郵件和密碼輸入
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // 表單資料狀態
  const [formData, setFormData] = useState({
    name: 'ryowu',
    email: 'ryowu0329@gmail.com',
    password: 'leo140814',
    confirmPassword: 'leo140814',
  });

  // 控制密碼顯示狀態
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // 驗證所有必填欄位
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error('請填寫所有欄位');
      return;
    }

    // 驗證密碼是否一致
    if (formData.password !== formData.confirmPassword) {
      toast.error('密碼不一致');
      return;
    }

    setLoading(true);
    try {
      // 發送註冊請求
      await register(formData);
      toast.success('註冊成功！請檢查您的電子郵件以驗證帳號');
      navigate('/verify-email', {
        state: { email: formData.email },
        replace: true,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || '註冊失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 切換密碼顯示狀態
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 切換確認密碼顯示狀態
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            註冊帳號
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* 姓名輸入欄位 */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="姓名"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            {/* 電子郵件輸入欄位 */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="電子郵件"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            {/* 密碼輸入欄位 */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密碼"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* 確認密碼輸入欄位 */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="確認密碼"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* 註冊按鈕 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '註冊中...' : '註冊'}
            </Button>
            {/* 登入連結 */}
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                已有帳號？登入
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
