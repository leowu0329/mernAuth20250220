// 導入必要的路由和元件
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingScreen from './LoadingScreen';

/**
 * 公開路由元件
 * 用於處理不需要登入就能訪問的頁面
 * 如果用戶已登入，將重定向到儀表板頁面
 */
const PublicRoute = () => {
  // 從 AuthContext 獲取用戶狀態和載入狀態
  const { user, loading } = useAuth();

  // 如果正在載入，顯示載入畫面
  if (loading) {
    return <LoadingScreen />;
  }

  // 如果用戶已登入，重定向到儀表板
  // 否則顯示子路由內容
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
