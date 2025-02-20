// 導入必要的 React Hooks 和元件
import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment, IconButton } from '@mui/material';
// 導入密碼可見性切換圖示
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * 密碼輸入框元件
 * 提供密碼輸入功能，包含顯示/隱藏密碼的切換按鈕
 * @param {Object} props - 元件屬性
 * @param {string} props.value - 密碼值
 * @param {function} props.onChange - 密碼變更處理函數
 * @param {boolean} props.error - 是否顯示錯誤狀態
 * @param {string} props.helperText - 輔助說明文字
 * @param {string} props.label - 輸入框標籤文字
 */
const PasswordInput = ({
  value,
  onChange,
  error,
  helperText,
  label = '密碼',
}) => {
  // 控制密碼是否可見的狀態
  const [showPassword, setShowPassword] = useState(false);

  // 處理密碼可見性切換
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      fullWidth
      type={showPassword ? 'text' : 'password'} // 根據狀態切換輸入框類型
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      InputProps={{
        // 在輸入框尾端加入密碼可見性切換按鈕
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

// 定義元件屬性型別
PasswordInput.propTypes = {
  value: PropTypes.string.isRequired, // 密碼值（必要）
  onChange: PropTypes.func.isRequired, // 變更處理函數（必要）
  error: PropTypes.bool, // 錯誤狀態
  helperText: PropTypes.string, // 輔助文字
  label: PropTypes.string, // 標籤文字
};

export default PasswordInput;
