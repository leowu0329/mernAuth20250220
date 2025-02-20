// 導入必要的 React Hook 和路由元件
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// 導入 Material-UI 元件
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
// 導入提示訊息元件
import { toast } from 'react-toastify';
// 導入 API 工具
import api from '../utils/api';
// 導入身份驗證相關 Hook
import { useAuth } from '../context/AuthContext.jsx'; // 修改擴展名

/**
 * 重設密碼頁面元件
 * 提供使用者重設密碼的功能
 */
const ResetPassword = () => {
  // 從 URL 獲取重設密碼 token
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  // 表單狀態管理
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // 載入狀態
  const [loading, setLoading] = useState(false);

  // 檢查 token 是否存在
  useEffect(() => {
    if (!token) {
      toast.error('無效的重設密碼連結');
      navigate('/login');
    }
  }, [token, navigate]);

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 驗證密碼是否一致
    if (password !== confirmPassword) {
      toast.error('密碼不一致');
      return;
    }

    setLoading(true);
    try {
      // 發送重設密碼請求
      await api.post('/auth/reset-password', { token, password });
      toast.success('密碼已重設成功');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || '重設密碼失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* 頁面標題 */}
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            重設密碼
          </Typography>
          {/* 重設密碼表單 */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* 新密碼輸入框 */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="新密碼"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* 確認新密碼輸入框 */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="確認新密碼"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* 提交按鈕 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '處理中...' : '重設密碼'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
