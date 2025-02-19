import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// 獲取用戶資料
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '獲取用戶資料失敗', error: error.message });
  }
};

// 更新用戶資料
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '找不到用戶' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: '更新用戶資料失敗', error: error.message });
  }
};

// 修改密碼
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '找不到用戶' });
    }

    // 驗證當前密碼
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '當前密碼不正確' });
    }

    // 加密新密碼
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: '密碼修改成功' });
  } catch (error) {
    res.status(500).json({ message: '修改密碼失敗', error: error.message });
  }
};
