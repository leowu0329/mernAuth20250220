/* global process */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

/**
 * 保護路由中間件
 * 驗證用戶是否已登入，並檢查 JWT token 是否有效
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 從請求標頭獲取 Bearer token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: '請先登入' });
    }

    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 檢查用戶是否存在
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: '用戶不存在' });
    }

    // 將用戶信息添加到請求對象
    req.user = user;
    next();
  } catch (error) {
    console.error('Protect middleware error:', error);
    res.status(401).json({ message: '未授權的訪問', error: error.message });
  }
};

/**
 * Token 驗證中間件
 * 驗證請求中的 JWT token 是否有效
 */
export const verifyToken = (req, res, next) => {
  try {
    // 從請求標頭獲取 token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: '未提供認證令牌' });
    }

    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 將解碼後的用戶資訊添加到請求對象
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res
      .status(401)
      .json({ message: '無效的認證令牌', error: error.message });
  }
};

/**
 * 管理員權限檢查中間件
 * 驗證用戶是否具有管理員權限
 */
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error('User not found in request');
    }

    // 檢查用戶是否具有管理員權限
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: '需要管理員權限' });
    }
  } catch (error) {
    console.error('Admin check error:', error);
    res
      .status(500)
      .json({ message: '檢查管理員權限時發生錯誤', error: error.message });
  }
};
