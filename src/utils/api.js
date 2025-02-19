import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 確保這裡的端口號與你的後端服務一致
  headers: {
    'Content-Type': 'application/json',
  },
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
  },
);

// 響應攔截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || '發生錯誤，請稍後再試';

    switch (error.response?.status) {
      case 401:
        // 未授權，清除 token
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case 403:
        toast.error('您沒有權限執行此操作');
        break;
      case 404:
        toast.error('找不到請求的資源');
        break;
      case 422:
        toast.error(message);
        break;
      default:
        toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
