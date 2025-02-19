import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import PasswordInput from '../components/PasswordInput';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = '請輸入目前的密碼';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = '請輸入新密碼';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = '密碼長度至少需要6個字符';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請確認新密碼';
    } else if (formData.newPassword !== formData.confirmPassword) {
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
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:5000/api/users/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '修改密碼失敗');
      }

      toast.success('密碼修改成功！');
      navigate('/profile');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
            修改密碼
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PasswordInput
                  value={formData.currentPassword}
                  onChange={handleChange}
                  name="currentPassword"
                  label="目前密碼"
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                />
              </Grid>

              <Grid item xs={12}>
                <PasswordInput
                  value={formData.newPassword}
                  onChange={handleChange}
                  name="newPassword"
                  label="新密碼"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
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
                  {loading ? <CircularProgress size={24} /> : '修改密碼'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                >
                  返回個人資料
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangePassword;
