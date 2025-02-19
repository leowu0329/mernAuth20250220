/* global process */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../utils/email.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

// 生成 JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// 生成驗證碼
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 生成重設密碼 token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 註冊
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 檢查必要欄位
    if (!name || !email || !password) {
      return res.status(400).json({ message: '所有欄位都是必填的' });
    }

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '此電子郵件已被註冊' });
    }

    // 生成驗證碼
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 創建新用戶
    const user = new User({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
    });

    // 儲存用戶
    await user.save();

    // 發送驗證郵件
    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    // 返回用戶資訊，但不包含 token（因為還未驗證）
    res.status(201).json({
      user: {
        email: user.email,
      },
      message: '註冊成功，請檢查您的電子郵件以驗證帳號',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: '註冊過程中發生錯誤',
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: '驗證碼無效或已過期' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // 生成 token
    const token = generateToken(user._id);

    res.json({
      message: '郵箱驗證成功',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: '驗證失敗', error: error.message });
  }
};

// 登入
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 檢查用戶是否存在
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '電子郵件或密碼錯誤' });
    }

    // 檢查密碼是否正確
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '電子郵件或密碼錯誤' });
    }

    // 檢查用戶是否已驗證
    if (!user.isVerified) {
      return res.status(401).json({
        status: 'UNVERIFIED',
        message: '請先驗證您的郵箱',
        email: user.email,
      });
    }

    // 生成 token
    const token = generateToken(user._id);

    // 返回用戶資訊（不包含密碼）
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '登入失敗', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: '找不到此電子郵件地址的用戶' });
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24小時後過期
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken);
      res.json({ message: '重設密碼連結已發送到您的電子郵件' });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(500).json({ message: '發送重設密碼郵件失敗' });
    }
  } catch (error) {
    console.error('Reset password request failed:', error);
    res.status(500).json({ message: '重設密碼請求失敗', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: '重設密碼連結無效或已過期' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: '密碼重設成功' });
  } catch (error) {
    res.status(500).json({ message: '重設密碼失敗', error: error.message });
  }
};

// 重新發送驗證碼
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: '找不到此電子郵件地址的用戶' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: '此帳號已經驗證過了' });
    }

    // 使用抽取的函數生成驗證碼
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小時後過期

    // 更新用戶的驗證碼
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // 發送驗證郵件
    await sendVerificationEmail(user.email, verificationCode);

    res.json({ message: '驗證碼已重新發送到您的電子郵件' });
  } catch (error) {
    console.error('重新發送驗證碼失敗:', error);
    res
      .status(500)
      .json({ message: '重新發送驗證碼失敗', error: error.message });
  }
};

// 獲取當前用戶信息
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: '獲取用戶信息失敗', error: error.message });
  }
};
