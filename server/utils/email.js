/* global process */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

// 創建郵件傳輸器
// 使用 nodemailer 建立 SMTP 傳輸器，用於發送電子郵件
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP 伺服器主機
  port: process.env.SMTP_PORT, // SMTP 伺服器埠號
  secure: false, // 是否使用 SSL/TLS
  auth: {
    user: process.env.EMAIL_USER, // 寄件者電子郵件
    pass: process.env.EMAIL_PASS, // 寄件者密碼
  },
});

// 測試郵件連接
// 驗證 SMTP 伺服器連線是否正常
transporter.verify((error) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

/**
 * 發送驗證郵件
 * @param {string} to - 收件者電子郵件地址
 * @param {string} verificationCode - 驗證碼
 * @returns {Promise} 郵件發送結果
 */
export const sendVerificationEmail = async (to, verificationCode) => {
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`, // 寄件者名稱和地址
    to: to, // 收件者地址
    subject: '驗證您的電子郵件', // 郵件主旨
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

/**
 * 發送重設密碼郵件
 * @param {string} to - 收件者電子郵件地址
 * @param {string} resetToken - 重設密碼的 Token
 * @returns {Promise} 郵件發送結果
 */
export const sendPasswordResetEmail = async (to, resetToken) => {
  // 建立重設密碼連結
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`, // 寄件者名稱和地址
    to: to, // 收件者地址
    subject: '重設您的密碼', // 郵件主旨
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
