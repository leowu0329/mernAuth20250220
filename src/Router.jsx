// 導入必要的 React 元件和工具
import { Suspense, lazy } from 'react';
import {
  Route,
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import PropTypes from 'prop-types';
import { useAuth } from './context/AuthContext.jsx';

// 直接導入的頁面元件
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// 使用延遲載入的頁面元件
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));

/**
 * 受保護的路由元件
 * 用於確保只有已登入的用戶可以訪問特定頁面
 * @param {Object} props - 元件屬性
 * @param {ReactNode} props.children - 子元件
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 如果正在載入，顯示載入中訊息
  if (loading) {
    return <div>Loading...</div>;
  }

  // 根據用戶登入狀態決定顯示內容或重定向到登入頁面
  return user ? children : <Navigate to="/login" replace />;
};

// 定義 PrivateRoute 的屬性類型
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// 創建路由配置
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* 公開路由 - 不需要登入即可訪問 */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* 受保護路由 - 需要登入才能訪問 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* 預設路由重定向 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>,
  ),
  {
    // React Router v7 的實驗性功能配置
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
);

/**
 * 路由提供者元件
 * 處理應用程式的路由導航，並提供延遲載入功能
 */
const Router = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Router;
