// 導入必要的模組
import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

// 建立 Express 路由器實例
const router = express.Router();

// 註冊新用戶
router.post('/register', register);
// 用戶登入
router.post('/login', login);
// 驗證電子郵件
router.post('/verify-email', verifyEmail);
// 重新發送驗證碼
router.post('/resend-verification', resendVerificationCode);
// 忘記密碼處理
router.post('/forgot-password', forgotPassword);
// 重設密碼
router.post('/reset-password', resetPassword);
// 獲取當前登入用戶資訊 (需要驗證)
router.get('/me', protect, getCurrentUser);

export default router;
