/* global process */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// 創建郵件傳輸器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 測試郵件連接
transporter.verify((error) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// 發送驗證郵件
export const sendVerificationEmail = async (to, verificationCode) => {
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: '驗證您的電子郵件',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>驗證您的電子郵件</h2>
        <p>感謝您註冊！請使用以下驗證碼完成註冊：</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; margin: 20px 0;">
          <strong>${verificationCode}</strong>
        </div>
        <p>此驗證碼將在 24 小時後過期。</p>
        <p>如果您沒有註冊帳號，請忽略此郵件。</p>
      </div>
    `,
  };

  try {
    console.log('Attempting to send verification email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// 發送重設密碼郵件
export const sendPasswordResetEmail = async (to, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: '重設您的密碼',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">重設密碼</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          您收到這封郵件是因為您（或其他人）請求重設密碼。
          請點擊下方連結重設您的密碼：
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; font-size: 16px;">
            重設密碼
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          此連結將在 24 小時後失效。<br>
          如果您沒有請求重設密碼，請忽略此郵件。
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
