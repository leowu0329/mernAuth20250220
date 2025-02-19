import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext.jsx'; // 修改擴展名

// 驗證碼輸入框組件
const VerificationInput = ({ value, onChange, disabled }) => {
  const inputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef());

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleChange = (e, index) => {
    const newValue = e.target.value;
    if (newValue.match(/^[0-9]$/)) {
      const newCode = [...value];
      newCode[index] = newValue;
      onChange(newCode.join(''));

      if (index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  return (
    <Stack direction="row" spacing={1} justifyContent="center" sx={{ my: 3 }}>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength="1"
            value={value[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={disabled}
            style={{
              width: '40px',
              height: '40px',
              fontSize: '20px',
              textAlign: 'center',
              margin: '0 4px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              outline: 'none',
            }}
          />
        ))}
    </Stack>
  );
};

VerificationInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // 從 location state 獲取 email
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      navigate('/register');
      return;
    }
    setEmail(emailFromState);
  }, [location, navigate]);

  useEffect(() => {
    // 倒數計時器
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error('請輸入完整的驗證碼');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/verify-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            code: verificationCode,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '驗證失敗');
      }

      toast.success('郵箱驗證成功！');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
      setVerificationCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendDisabled(true);
    setCountdown(30); // 30秒冷卻時間

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/resend-verification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '重新發送失敗');
      }

      toast.success('新的驗證碼已發送到您的郵箱');
    } catch (error) {
      toast.error(error.message);
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            驗證您的郵箱
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            我們已發送驗證碼至：
            <br />
            <strong>{email}</strong>
          </Typography>

          <VerificationInput
            value={verificationCode}
            onChange={setVerificationCode}
            disabled={loading}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleVerify}
            disabled={loading || verificationCode.length !== 6}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : '驗證'}
          </Button>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              沒有收到驗證碼？
            </Typography>
            <Button
              variant="text"
              onClick={handleResendCode}
              disabled={resendDisabled}
            >
              {resendDisabled ? `重新發送 (${countdown}s)` : '重新發送驗證碼'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
