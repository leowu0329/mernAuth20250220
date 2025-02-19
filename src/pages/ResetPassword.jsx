import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import PasswordInput from '../components/PasswordInput';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    // 從 URL 獲取 token
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    
    if (!resetToken) {
      setTokenError('無效的重設密碼連結');
      return;
    }
    
    setToken(resetToken);
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除相關錯誤
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = '請輸入新密碼';
    } else if (formData.password.length < 6) {
      newErrors.password = '密碼長度至少需要6個字符';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請確認新密碼';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '兩次輸入的密碼不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '重設密碼失敗');
      }

      toast.success('密碼重設成功！');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
      if (error.message.includes('無效') || error.message.includes('過期')) {
        setTokenError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 如果 token 無效，顯示錯誤訊息
  if (tokenError) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: 3
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              textAlign: 'center'
            }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {tokenError}
            </Alert>
            <Typography paragraph>
              請重新發送重設密碼請求。
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/forgot-password')}
            >
              重新發送重設密碼請求
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%'
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            重設密碼
          </Typography>
          
          <Typography color="text.secondary" align="center" paragraph>
            請輸入您的新密碼
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PasswordInput
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  label="新密碼"
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              
              <Grid item xs={12}>
                <PasswordInput
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  label="確認新密碼"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
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
                  {loading ? <CircularProgress size={24} /> : '重設密碼'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" align="center">
                  密碼重設成功後，您將被導向到登入頁面。
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;