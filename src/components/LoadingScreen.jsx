import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <CircularProgress />
      <Typography
        variant="h6"
        sx={{ mt: 2 }}
        color="text.secondary"
      >
        載入中...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;