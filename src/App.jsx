// 導入必要的元件和工具
import { ErrorBoundary } from './components/ErrorBoundary/index.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider } from './context/LanguageProvider.jsx';
import Router from './Router.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * App 根元件
 * 提供全域狀態管理和錯誤邊界
 */
function App() {
  return (
    // 最外層錯誤邊界，用於捕獲整個應用程式的錯誤
    <ErrorBoundary>
      {/* 語言提供者，處理國際化 */}
      <LanguageProvider>
        {/* 主題提供者，處理明暗主題切換 */}
        <ThemeProvider>
          {/* 身份驗證提供者，處理用戶登入狀態 */}
          <AuthProvider>
            {/* 路由錯誤邊界，專門處理路由相關錯誤 */}
            <ErrorBoundary key="router-error-boundary">
              <Router />
            </ErrorBoundary>
            {/* 提示訊息容器，用於顯示全域通知 */}
            <ToastContainer
              position="top-right" // 顯示在右上角
              autoClose={3000} // 3秒後自動關閉
              hideProgressBar={false} // 顯示進度條
              newestOnTop // 最新的訊息顯示在最上方
              closeOnClick // 點擊後關閉
              rtl={false} // 不使用從右到左的佈局
              pauseOnFocusLoss // 當失去焦點時暫停倒數
              draggable // 可拖曳
              pauseOnHover // 滑鼠懸停時暫停倒數
            />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
