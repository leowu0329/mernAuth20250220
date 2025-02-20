// 導入必要的套件
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * 建立 axios 實例
 * 設定基礎 URL 和預設請求標頭
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 確保這裡的端口號與你的後端服務一致
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 請求攔截器
 * 在發送請求前檢查並添加認證 token
 */
api.interceptors.request.use(
  (config) => {
    // 從本地儲存取得 token
    const token = localStorage.getItem('token');
    // 如果有 token 則加入到請求標頭
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 響應攔截器
 * 統一處理 API 響應錯誤
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 取得錯誤訊息，如果沒有則使用預設訊息
    const message = error.response?.data?.message || '發生錯誤，請稍後再試';

    // 根據錯誤狀態碼處理不同情況
    switch (error.response?.status) {
      case 401: // 未授權
        // 清除 token 並重新導向到登入頁面
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case 403: // 禁止訪問
        toast.error('您沒有權限執行此操作');
        break;
      case 404: // 資源不存在
        toast.error('找不到請求的資源');
        break;
      case 422: // 驗證錯誤
        toast.error(message);
        break;
      default: // 其他錯誤
        toast.error(message);
    }

    return Promise.reject(error);
  },
);

// 導出 API 實例
export default api;
