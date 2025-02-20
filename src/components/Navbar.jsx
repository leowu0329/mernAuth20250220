// 導入必要的 React 和路由相關模組
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// 導入 Material-UI 元件
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Divider,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
// 導入 Material Icons
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
// 導入提示訊息元件
import { toast } from 'react-toastify';

/**
 * 導航欄元件
 * 包含 Logo、選單項目和使用者資訊
 */
const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  // 判斷是否為手機版畫面
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // 控制使用者選單和手機版選單的開關狀態
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  // 從 localStorage 獲取用戶資訊
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 開啟使用者選單
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 開啟手機版選單
  const handleOpenMobileMenu = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  // 關閉使用者選單
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  // 關閉手機版選單
  const handleCloseMobileMenu = () => {
    setMobileAnchorEl(null);
  };

  // 處理登出功能
  const handleLogout = () => {
    handleCloseUserMenu();
    // 清除本地存儲的用戶資訊
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('已成功登出');
    navigate('/login');
  };

  // 定義選單項目
  const menuItems = [
    {
      label: '首頁',
      icon: <DashboardIcon fontSize="small" />,
      onClick: () => navigate('/'),
    },
    {
      label: '個人資料',
      icon: <PersonIcon fontSize="small" />,
      onClick: () => navigate('/profile'),
    },
    {
      label: '修改密碼',
      icon: <SettingsIcon fontSize="small" />,
      onClick: () => navigate('/change-password'),
    },
  ];

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo 區域 */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            LOGO
          </Typography>

          {/* 手機版選單 */}
          {isMobile && (
            <>
              <IconButton
                size="large"
                aria-controls="menu-mobile"
                aria-haspopup="true"
                onClick={handleOpenMobileMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-mobile"
                anchorEl={mobileAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(mobileAnchorEl)}
                onClose={handleCloseMobileMenu}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      handleCloseMobileMenu();
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">登出</Typography>
                </MenuItem>
              </Menu>
            </>
          )}

          {/* 桌面版選單 */}
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={item.onClick}
                    sx={{ color: 'white' }}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* 使用者頭像和下拉選單 */}
              <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.name} src="/static/images/avatar/2.jpg" />
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem disabled>
                    <Typography textAlign="center">{user.name}</Typography>
                  </MenuItem>
                  <Divider />
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        handleCloseUserMenu();
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <Typography textAlign="center">{item.label}</Typography>
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">登出</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
