import nodemailer from 'nodemailer';

// Create a transporter for nodemailer using provided credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'harishmkr88@gmail.com',
    pass: process.env.EMAIL_PASS || 'hlkr znlr gexc xhqh'
  }
});

/**
 * Send an OTP verification email to the user
 * @param {string} to - Recipient email address
 * @param {string} otp - One-time password
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendOTPEmail = async (to, otp) => {
  console.log("💯Sending OTP email to:", to);
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'harishmkr88@gmail.com',
      to,
      subject: 'La Patisserie - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333;">La Patisserie</h2>
            <p style="font-size: 16px; color: #555;">Email Verification</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <p style="font-size: 16px; margin-bottom: 10px;">Hello,</p>
            <p style="font-size: 14px; margin-bottom: 20px;">Thank you for providing your email address. Please use the following OTP to verify your email:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 24px; font-weight: bold; letter-spacing: 10px; background-color: #f0f0f0; padding: 15px; border-radius: 5px;">${otp}</div>
            </div>
            
            <p style="font-size: 14px; margin-bottom: 10px;">This OTP is valid for 10 minutes. If you did not request this verification, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
            <p>&copy; ${new Date().getFullYear()} La Patisserie. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error?.response || error?.message || error);
    throw error;
  }
};

/**
 * Generate a random 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Verify if the provided OTP matches the stored OTP
 * @param {string} providedOTP - OTP provided by the user
 * @param {string} storedOTP - OTP stored in the database
 * @returns {boolean} - True if OTP matches, false otherwise
 */
export const verifyOTP = (providedOTP, storedOTP) => {
  return providedOTP === storedOTP;
};

/**
 * Send a welcome email after successful email verification
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name (optional)
 * @returns {Promise<boolean>} - Resolves true if sent
 */
export const sendWelcomeEmail = async (to, name = 'there') => {
  try {
    const mailOptions = {
      from: EMAIL_FROM || EMAIL_USER,
      to,
      subject: 'Welcome to La Patisserie 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333;">Welcome to La Patisserie</h2>
            <p style="font-size: 16px; color: #555;">We're thrilled to have you, ${name}!</p>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <p style="font-size: 14px; margin-bottom: 10px;">Your email has been verified successfully.</p>
            <p style="font-size: 14px; margin-bottom: 10px;">You can now receive order updates, special offers, and delicious news directly in your inbox.</p>
            <p style="font-size: 14px; margin-bottom: 10px;">We can’t wait to sweeten your day!</p>
          </div>
          <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
            <p>&copy; ${new Date().getFullYear()} La Patisserie. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email: ', error?.response || error?.message || error);
    throw error;
  }
};

/**
 * Retry wrapper for welcome email to improve deliverability in transient failures
 * @param {string} to
 * @param {string} name
 * @param {number} retries - number of retries on failure
 */
export const sendWelcomeEmailWithRetry = async (to, name = 'there', retries = 1) => {
  try {
    return await sendWelcomeEmail(to, name);
  } catch (err) {
    if (retries > 0) {
      console.warn('Welcome email failed, retrying...', { to, retriesLeft: retries });
      // brief backoff
      await new Promise((res) => setTimeout(res, 1000));
      return await sendWelcomeEmailWithRetry(to, name, retries - 1);
    }
    throw err;
  }
};