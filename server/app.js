const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const config = require('./config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const habitRoutes = require('./routes/habitRoutes');
const goalRoutes = require('./routes/goalRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const learningRoutes = require('./routes/learningRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Strip trailing slashes for comparison
    const sanitizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.includes(sanitizedOrigin) || 
                      sanitizedOrigin.endsWith('.vercel.app') || 
                      sanitizedOrigin === config.clientUrl;
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'LifeOS API is running', timestamp: new Date().toISOString() });
});

app.get('/api/docs', (req, res) => {
  res.json({
    name: 'LifeOS API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/google': 'Google OAuth login',
        'POST /api/auth/refresh': 'Refresh access token',
        'POST /api/auth/logout': 'Logout (protected)',
        'GET /api/auth/me': 'Get current user (protected)',
        'PUT /api/auth/profile': 'Update profile (protected)',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password',
      },
      tasks: 'CRUD + reorder + calendar at /api/tasks',
      habits: 'CRUD + toggle + stats at /api/habits',
      goals: 'CRUD + milestones at /api/goals',
      expenses: 'CRUD + budgets + reports at /api/expenses',
      learning: 'CRUD + analytics at /api/learning',
      analytics: 'Dashboard + reports at /api/analytics',
      ai: 'AI insights at /api/ai',
      notifications: 'Notifications at /api/notifications',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`LifeOS Server running on port ${PORT} [${config.nodeEnv}]`);
  });
};

startServer();

module.exports = app;
