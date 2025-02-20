// 導入必要的模組
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import process from 'process';

// 確保在其他代碼之前配置環境變數
dotenv.config({ path: '.env' });

// 檢查環境變數是否正確載入
console.log('MONGODB_URI:', process.env.MONGODB_URI); // 用於調試
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// 創建 Express 應用程式實例
const app = express();

// 設定中間件
app.use(
  cors({
    origin: [
      'https://mernauth20250220.onrender.com',
      'http://localhost:5173', // 開發環境用
    ],
    credentials: true,
  }),
); // 啟用跨域資源共享
app.use(express.json()); // 解析 JSON 請求體

// 確保 MongoDB 連接字串存在
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// MongoDB 資料庫連接設定
const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true, // 使用新的 URL 解析器
      useUnifiedTopology: true, // 使用新的伺服器發現和監控引擎
    };
    console.log('Attempting to connect to MongoDB with options:', options);
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('Successfully connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Connection string used:', process.env.MONGODB_URI);
    process.exit(1);
  }
};

// 連接資料庫
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// 監聽資料庫連接事件
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// 監聽資料庫錯誤事件
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  console.error('Current connection state:', mongoose.connection.readyState);
});

// 監聽資料庫斷開連接事件
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  console.log('Current connection state:', mongoose.connection.readyState);
});

// 處理應用程式終止時的資料庫連接關閉
process.on('SIGINT', async () => {
  try {
    console.log(
      'Received SIGINT signal, attempting to close MongoDB connection',
    );
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

// 設定 API 路由
app.use('/api/auth', authRoutes); // 驗證相關路由
app.use('/api/users', userRoutes); // 使用者相關路由

// 全域錯誤處理中間件
app.use((err, req, res, _next) => {
  // _next 參數表示故意不使用的參數
  console.error('Error details:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({
    message: '伺服器發生錯誤',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 設定伺服器監聽埠
const PORT = process.env.PORT || 5000;

// 啟動伺服器
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Server environment:', process.env.NODE_ENV);
});

// 處理伺服器錯誤事件
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

// 導出 Express 應用程式實例
export default app;
