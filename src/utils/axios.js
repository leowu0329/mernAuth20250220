import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || '發生錯誤，請稍後再試';
    
    // 處理特定錯誤狀態
    switch (error.response?.status) {
      case 401:
        // Token 過期或無效
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('您沒有權限執行此操作');
        break;
      case 404:
        toast.error('找不到請求的資源');
        break;
      case 429:
        toast.error('請求過於頻繁，請稍後再試');
        break;
      case 500:
        toast.error('伺服器錯誤，請稍後再試');
        break;
      default:
        toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;