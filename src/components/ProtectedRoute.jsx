// 導入必要的路由和元件
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingScreen from './LoadingScreen';

/**
 * 受保護路由元件
 * 用於保護需要登入才能訪問的頁面
 * 如果用戶未登入，將重定向到登入頁面
 */
const ProtectedRoute = () => {
  // 從 AuthContext 獲取用戶狀態和載入狀態
  const { user, loading } = useAuth();

  // 如果正在載入，顯示載入畫面
  if (loading) {
    return <LoadingScreen />;
  }

  // 如果用戶已登入，顯示子路由內容
  // 否則重定向到登入頁面
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
