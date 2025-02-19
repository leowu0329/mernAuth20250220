import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../controllers/userController.js';

const router = express.Router();

// 獲取用戶資料
router.get('/profile', verifyToken, getUserProfile);

// 更新用戶資料
router.put('/profile', verifyToken, updateUserProfile);

// 修改密碼
router.put('/change-password', verifyToken, changePassword);

export default router;
