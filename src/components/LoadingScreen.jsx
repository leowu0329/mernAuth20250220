// 導入必要的 Material-UI 元件
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * 載入畫面元件
 * 用於顯示載入中的狀態，包含旋轉進度圈和文字提示
 * @returns {JSX.Element} 載入畫面
 */
const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex', // 使用 flex 布局
        flexDirection: 'column', // 垂直排列子元素
        alignItems: 'center', // 水平置中
        justifyContent: 'center', // 垂直置中
        minHeight: '100vh', // 最小高度為視窗高度
        bgcolor: 'background.default', // 使用預設背景色
      }}
    >
      {/* 顯示旋轉的進度圈 */}
      <CircularProgress />
      {/* 載入提示文字 */}
      <Typography
        variant="h6"
        sx={{ mt: 2 }} // 上方邊距
        color="text.secondary" // 使用次要文字顏色
      >
        載入中...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
