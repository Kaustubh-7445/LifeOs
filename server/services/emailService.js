const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

const getTransporter = () => {
  const isPlaceholder = !config.email.user || 
                        config.email.user.includes('your-email') || 
                        config.email.pass.includes('your-gmail-app-password') ||
                        config.email.user === '';

  if (!transporter && !isPlaceholder) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: { user: config.email.user, pass: config.email.pass },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  const transport = getTransporter();
  if (!transport) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    // Parse out OTP or Reset links for ease of local testing
    const otpMatch = html.match(/>(\d{6})<\/div>/) || html.match(/>(\d{6})</);
    if (otpMatch) {
      console.log(`[Email Mock] Verification OTP Code: ${otpMatch[1]}`);
    }
    const linkMatch = html.match(/href="([^"]+)"/);
    if (linkMatch) {
      console.log(`[Email Mock] Clickable Link: ${linkMatch[1]}`);
    }
    return { mock: true };
  }
  return transport.sendMail({ from: config.email.from, to, subject, html });
};

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">LifeOS Password Reset</h2>
      <p>You requested a password reset. Click the button below:</p>
      <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p style="color: #666; font-size: 12px;">If you didn't request this, ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'LifeOS - Reset Your Password', html });
};

const sendOtpEmail = async (email, otp) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #6366f1; margin: 0; font-size: 26px; font-weight: 700;">LifeOS Verification</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Your personal life operating system</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">Welcome to LifeOS! To verify your email address, please use the following one-time password (OTP):</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px 30px; font-size: 32px; font-weight: 700; color: #4f46e5; letter-spacing: 6px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">${otp}</div>
      </div>
      <p style="font-size: 13px; color: #ef4444; font-weight: 500; text-align: center; margin-bottom: 25px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">If you didn't create an account with LifeOS, you can safely ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'LifeOS - Verify Your Email', html });
};

module.exports = { sendEmail, sendResetPasswordEmail, sendOtpEmail };
