// 導入必要的模組
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 定義使用者資料模型結構
const userSchema = new mongoose.Schema(
  {
    // 使用者名稱
    name: {
      type: String,
      required: true, // 必填欄位
      trim: true, // 自動移除前後空白
    },
    // 電子郵件
    email: {
      type: String,
      required: true, // 必填欄位
      unique: true, // 不可重複
      trim: true, // 自動移除前後空白
      lowercase: true, // 轉換為小寫
    },
    // 密碼
    password: {
      type: String,
      required: true, // 必填欄位
    },
    // 帳號是否已驗證
    isVerified: {
      type: Boolean,
      default: false, // 預設為未驗證
    },
    // 驗證碼
    verificationCode: {
      type: String,
      default: null, // 預設為空
    },
    // 驗證碼有效期限
    verificationCodeExpires: {
      type: Date,
      default: null, // 預設為空
    },
    // 重設密碼的 Token
    resetPasswordToken: {
      type: String,
      default: null, // 預設為空
    },
    // 重設密碼 Token 的有效期限
    resetPasswordExpires: {
      type: Date,
      default: null, // 預設為空
    },
  },
  {
    timestamps: true, // 自動添加建立時間和更新時間欄位
  },
);

// 密碼加密中間件
// 在儲存文件前自動進行密碼加密
userSchema.pre('save', async function (next) {
  // 如果密碼沒有被修改，則跳過加密步驟
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // 生成加密用的 salt
    const salt = await bcrypt.genSalt(10);
    // 使用 bcrypt 進行密碼加密
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 驗證密碼方法
// 比對使用者輸入的密碼是否正確
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 導出使用者模型
export default mongoose.model('User', userSchema);
