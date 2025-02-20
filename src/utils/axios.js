// 導入必要的套件
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * 建立 axios 實例
 * 設定基礎 URL 和請求超時時間
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // API 基礎路徑
  timeout: 10000, // 請求超時時間為 10 秒
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
 * 統一處理 API 響應和錯誤
 */
api.interceptors.response.use(
  // 成功響應時直接返回數據
  (response) => response.data,
  // 錯誤處理
  (error) => {
    // 取得錯誤訊息，如果沒有則使用預設訊息
    const message = error.response?.data?.message || '發生錯誤，請稍後再試';

    // 根據錯誤狀態碼處理不同情況
    switch (error.response?.status) {
      case 401: // 未授權：Token 過期或無效
        // 清除本地儲存的認證資訊
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // 重新導向到登入頁面
        window.location.href = '/login';
        break;
      case 403: // 禁止訪問
        toast.error('您沒有權限執行此操作');
        break;
      case 404: // 資源不存在
        toast.error('找不到請求的資源');
        break;
      case 429: // 請求次數過多
        toast.error('請求過於頻繁，請稍後再試');
        break;
      case 500: // 伺服器錯誤
        toast.error('伺服器錯誤，請稍後再試');
        break;
      default: // 其他錯誤
        toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
