const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { asyncHandler, sendTokenResponse } = require('../utils/helpers');
const { generateResetToken, verifyRefreshToken } = require('../utils/tokens');
const { sendResetPasswordEmail, sendOtpEmail } = require('../services/emailService');
const config = require('../config');

const googleClient = config.google.clientId
  ? new OAuth2Client(config.google.clientId)
  : null;

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError('Email already registered', 400);

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password,
    isVerified: false,
    otpCode,
    otpExpires,
  });

  try {
    await sendOtpEmail(user.email, otpCode);
  } catch (emailError) {
    // Delete the unverified user so they can try to register again
    await User.deleteOne({ _id: user._id });
    console.error('Email sending failed during registration:', emailError);
    throw new AppError('Failed to send verification email. Please check your SMTP settings.', 500);
  }

  res.status(201).json({
    success: true,
    message: 'OTP verification email sent',
    data: { email: user.email },
  });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new AppError('Email and OTP are required', 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select('+otpCode +otpExpires');
  if (!user) throw new AppError('User not found', 404);

  if (user.isVerified) {
    throw new AppError('Account is already verified. Please log in.', 400);
  }

  if (user.otpCode !== otp) {
    throw new AppError('Invalid OTP code', 400);
  }

  if (user.otpExpires < new Date()) {
    throw new AppError('OTP code expired. Please request a new one.', 400);
  }

  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Verification successful');
});

exports.resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError('Email is required', 400);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new AppError('User not found', 404);

  if (user.isVerified) {
    throw new AppError('Account is already verified. Please log in.', 400);
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = otpCode;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOtpEmail(user.email, otpCode);

  res.json({ success: true, message: 'New verification OTP sent' });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !user.password) throw new AppError('Invalid credentials', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  if (!user.isVerified) {
    throw new AppError('Please verify your email address first.', 401);
  }

  sendTokenResponse(user, 200, res, 'Login successful');
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) throw new AppError('Google credential required', 400);

  if (!googleClient) {
    throw new AppError('Google login not configured. Set GOOGLE_CLIENT_ID.', 503);
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.google.clientId,
  });
  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });
  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture || '',
      isVerified: true,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    user.avatar = user.avatar || picture || '';
    await user.save();
  }

  sendTokenResponse(user, 200, res, 'Google login successful');
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) throw new AppError('Refresh token required', 401);

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new AppError('Invalid refresh token', 401);
  }

  sendTokenResponse(user, 200, res, 'Token refreshed');
});

exports.logout = asyncHandler(async (req, res) => {
  req.user.refreshToken = undefined;
  await req.user.save({ validateBeforeSave: false });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toPublicJSON() } });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, preferences } = req.body;
  if (name) req.user.name = name;
  if (avatar !== undefined) req.user.avatar = avatar;
  if (preferences) req.user.preferences = { ...req.user.preferences, ...preferences };
  await req.user.save();
  res.json({ success: true, message: 'Profile updated', data: { user: req.user.toPublicJSON() } });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) {
    return res.json({ success: true, message: 'If email exists, reset link sent' });
  }

  const { resetToken, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + config.resetTokenExpiry;
  await user.save({ validateBeforeSave: false });

  await sendResetPasswordEmail(user.email, resetToken);
  res.json({ success: true, message: 'If email exists, reset link sent' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire +password');

  if (!user) throw new AppError('Invalid or expired reset token', 400);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters', 400);
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user.password) {
    throw new AppError('Password login is not set for this account. Use Google sign-in.', 400);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect', 400);

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
});

exports.socialAuth = asyncHandler(async (req, res) => {
  const { email, name, provider, action } = req.body;
  if (!email) throw new AppError('Email is required', 400);
  if (!provider) throw new AppError('Provider (google or apple) is required', 400);

  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });

  if (action === 'login') {
    if (!user) {
      throw new AppError('Account is not registered. Please sign up first.', 404);
    }
    // Update provider ID if not set
    if (provider === 'google' && !user.googleId) {
      user.googleId = `mock-google-${normalizedEmail}`;
      await user.save();
    } else if (provider === 'apple' && !user.appleId) {
      user.appleId = `mock-apple-${normalizedEmail}`;
      await user.save();
    }
    return sendTokenResponse(user, 200, res, `${provider === 'google' ? 'Google' : 'Apple'} login successful`);
  } else if (action === 'register') {
    if (!user) {
      user = await User.create({
        name: name || `${provider === 'google' ? 'Google' : 'Apple'} User`,
        email: normalizedEmail,
        isVerified: true, // Social signup is automatically verified
        googleId: provider === 'google' ? `mock-google-${normalizedEmail}` : undefined,
        appleId: provider === 'apple' ? `mock-apple-${normalizedEmail}` : undefined,
      });
    } else {
      // User exists, link account
      if (provider === 'google' && !user.googleId) {
        user.googleId = `mock-google-${normalizedEmail}`;
        await user.save();
      } else if (provider === 'apple' && !user.appleId) {
        user.appleId = `mock-apple-${normalizedEmail}`;
        await user.save();
      }
    }
    return sendTokenResponse(user, 200, res, `${provider === 'google' ? 'Google' : 'Apple'} registration successful`);
  } else {
    throw new AppError('Invalid action (login or register required)', 400);
  }
});
