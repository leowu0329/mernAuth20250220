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

// 修改密碼頁面元件
const ChangePassword = () => {
  const navigate = useNavigate();
  // 載入狀態
  const [loading, setLoading] = useState(false);
  // 表單資料狀態
  const [formData, setFormData] = useState({
    currentPassword: '', // 目前密碼
    newPassword: '', // 新密碼
    confirmPassword: '', // 確認新密碼
  });
  // 錯誤訊息狀態
  const [errors, setErrors] = useState({});

  // 處理表單輸入變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清除對應欄位的錯誤訊息
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // 表單驗證
  const validateForm = () => {
    const newErrors = {};

    // 驗證目前密碼
    if (!formData.currentPassword) {
      newErrors.currentPassword = '請輸入目前的密碼';
    }

    // 驗證新密碼
    if (!formData.newPassword) {
      newErrors.newPassword = '請輸入新密碼';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = '密碼長度至少需要6個字符';
    }

    // 驗證確認密碼
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請確認新密碼';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '兩次輸入的密碼不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 表單驗證失敗則返回
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 從本地儲存取得認證 token
      const token = localStorage.getItem('token');
      // 發送修改密碼請求
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

      // 處理請求失敗的情況
      if (!response.ok) {
        throw new Error(data.message || '修改密碼失敗');
      }

      // 密碼修改成功，顯示提示訊息並導航至個人資料頁
      toast.success('密碼修改成功！');
      navigate('/profile');
    } catch (error) {
      // 顯示錯誤訊息
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 渲染頁面
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
          {/* 頁面標題 */}
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            修改密碼
          </Typography>

          {/* 密碼修改表單 */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              {/* 目前密碼輸入欄位 */}
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

              {/* 新密碼輸入欄位 */}
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

              {/* 確認新密碼輸入欄位 */}
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

              {/* 提交按鈕 */}
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

              {/* 返回按鈕 */}
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
