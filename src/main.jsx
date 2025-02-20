// 導入必要的 React 元件和工具
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 導入全域樣式
import './index.css';
// 導入根元件
import App from './App.jsx';

// 建立 React 根節點並渲染應用程式
createRoot(document.getElementById('root')).render(
  // 使用嚴格模式包裹應用程式，用於開發時偵錯
  <StrictMode>
    <App />
  </StrictMode>,
);
