import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      toast.success('已成功登出');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('登出失敗');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              歡迎回來，{user?.name}
            </Typography>
            <Button variant="contained" color="error" onClick={handleLogout}>
              登出
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary">
            這是您的個人儀表板
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
