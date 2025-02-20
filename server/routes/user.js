// 導入必要的模組
import express from 'express';
// 導入 Token 驗證中間件
import { verifyToken } from '../middleware/auth.js';
// 導入使用者控制器函數
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../controllers/userController.js';

// 建立 Express 路由器實例
const router = express.Router();

// 獲取用戶資料路由
// GET /api/users/profile
router.get('/profile', verifyToken, getUserProfile);

// 更新用戶資料路由
// PUT /api/users/profile
router.put('/profile', verifyToken, updateUserProfile);

// 修改密碼路由
// PUT /api/users/change-password
router.put('/change-password', verifyToken, changePassword);

// 導出路由器
export default router;
