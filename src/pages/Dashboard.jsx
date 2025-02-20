// 導入必要的 Material-UI 元件
import { Container, Typography, Box, Paper, Button } from '@mui/material';
// 導入身份驗證相關 Hook
import { useAuth } from '../context/AuthContext.jsx';
// 導入路由導航 Hook
import { useNavigate } from 'react-router-dom';
// 導入提示訊息元件
import { toast } from 'react-toastify';

/**
 * 儀表板頁面元件
 * 顯示用戶歡迎訊息和登出按鈕
 */
const Dashboard = () => {
  // 從身份驗證上下文獲取用戶資訊和登出函數
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 處理登出操作
  const handleLogout = () => {
    try {
      logout();
      toast.success('已成功登出！歡迎再次使用');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('登出時發生錯誤，請稍後再試');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {/* 頂部區域：包含歡迎訊息和登出按鈕 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            {/* 歡迎訊息 */}
            <Typography variant="h4" gutterBottom>
              歡迎回來，{user?.name}
            </Typography>
            {/* 登出按鈕 */}
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
              }}
            >
              登出
            </Button>
          </Box>
          {/* 儀表板說明文字 */}
          <Typography variant="body1" color="text.secondary">
            這是您的個人儀表板
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
