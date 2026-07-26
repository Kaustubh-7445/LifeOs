const crypto = require('crypto');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let accessSecret = process.env.JWT_ACCESS_SECRET;
let refreshSecret = process.env.JWT_REFRESH_SECRET;

if (isProduction) {
  if (!accessSecret || accessSecret.includes('change-me')) {
    throw new Error('FATAL: JWT_ACCESS_SECRET environment variable must be explicitly defined in production!');
  }
  if (!refreshSecret || refreshSecret.includes('change-me')) {
    throw new Error('FATAL: JWT_REFRESH_SECRET environment variable must be explicitly defined in production!');
  }
} else {
  accessSecret = accessSecret || crypto.randomBytes(32).toString('hex');
  refreshSecret = refreshSecret || crypto.randomBytes(32).toString('hex');
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeos',
  jwt: {
    accessSecret,
    refreshSecret,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  clientUrl: (process.env.CLIENT_URL || 'http://localhost:5173').trim().replace(/\/$/, ''),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'LifeOS <noreply@lifeos.app>',
  },
  resetTokenExpiry: 3600000,
};
