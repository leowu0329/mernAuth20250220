import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import process from 'process';

// 確保在其他代碼之前配置 dotenv
dotenv.config({ path: '.env' });

// 檢查環境變數
console.log('MONGODB_URI:', process.env.MONGODB_URI); // 用於調試
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 確保有 MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// MongoDB 連接配置
const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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

// 連接數據庫
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// 監聽數據庫連接事件
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  console.error('Current connection state:', mongoose.connection.readyState);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  console.log('Current connection state:', mongoose.connection.readyState);
});

// 優雅關閉連接
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

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 錯誤處理中間件
app.use((err, req, res, _next) => {
  // Using _next to indicate intentionally unused parameter
  console.error('Error details:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({
    message: '伺服器發生錯誤',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Server environment:', process.env.NODE_ENV);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

export default app;
