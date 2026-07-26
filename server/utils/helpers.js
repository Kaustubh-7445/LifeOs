const crypto = require('crypto');
const AppError = require('./AppError');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const { accessToken, refreshToken } = user.generateTokens();

  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  user.refreshToken = hashedRefreshToken;
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      success: true,
      message,
      data: {
        user: user.toPublicJSON(),
        accessToken,
      },
    });
};

const paginate = (page = 1, limit = 20) => {
  const p = Math.max(1, parseInt(page, 10));
  const l = Math.min(100, Math.max(1, parseInt(limit, 10)));
  return { skip: (p - 1) * l, limit: l, page: p };
};

module.exports = { asyncHandler, sendTokenResponse, paginate, AppError };
