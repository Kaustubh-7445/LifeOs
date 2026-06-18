require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const LearningResource = require('../models/LearningResource');
const Notification = require('../models/Notification');

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'demo@lifeos.app' });
    if (existing) {
      const userId = existing._id;
      await Promise.all([
        Task.deleteMany({ user: userId }),
        Habit.deleteMany({ user: userId }),
        Goal.deleteMany({ user: userId }),
        Expense.deleteMany({ user: userId }),
        Budget.deleteMany({ user: userId }),
        LearningResource.deleteMany({ user: userId }),
        Notification.deleteMany({ user: userId }),
        User.deleteOne({ _id: userId }),
      ]);
    }

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@lifeos.app',
      password: 'demo123',
      isVerified: true,
      preferences: { theme: 'dark', currency: 'USD' },
    });

    const tasks = await Task.insertMany([
      { user: user._id, title: 'Complete project proposal', category: 'work', priority: 'high', status: 'in-progress', dueDate: new Date(Date.now() + 86400000), order: 0 },
      { user: user._id, title: 'Morning workout', category: 'health', priority: 'medium', status: 'todo', dueDate: new Date(), order: 1 },
      { user: user._id, title: 'Read React docs', category: 'learning', priority: 'low', status: 'todo', order: 2 },
      { user: user._id, title: 'Pay electricity bill', category: 'finance', priority: 'urgent', status: 'todo', dueDate: new Date(Date.now() + 172800000), order: 3 },
      { user: user._id, title: 'Team standup meeting', category: 'work', priority: 'medium', status: 'done', completedAt: new Date(), order: 4 },
    ]);

    const habits = await Habit.insertMany([
      { user: user._id, name: 'Morning Meditation', icon: '🧘', color: '#8b5cf6', streak: 5, bestStreak: 12, completions: [{ date: new Date(), completed: true }] },
      { user: user._id, name: 'Drink 8 Glasses of Water', icon: '💧', color: '#06b6d4', streak: 3, bestStreak: 7 },
      { user: user._id, name: 'Read 30 Minutes', icon: '📚', color: '#f59e0b', streak: 10, bestStreak: 15, completions: [{ date: new Date(), completed: true }] },
      { user: user._id, name: 'Exercise', icon: '🏃', color: '#ef4444', streak: 2, bestStreak: 20 },
    ]);

    const goals = await Goal.insertMany([
      { user: user._id, title: 'Run a Marathon', category: 'fitness', targetValue: 42, currentValue: 15, unit: 'km/week', deadline: new Date(Date.now() + 90 * 86400000), color: '#ef4444', milestones: [{ title: 'Run 5K', completed: true, completedAt: new Date() }, { title: 'Run 10K' }, { title: 'Run Half Marathon' }] },
      { user: user._id, title: 'Save $10,000', category: 'financial', targetValue: 10000, currentValue: 3500, unit: 'USD', deadline: new Date(Date.now() + 180 * 86400000), color: '#10b981' },
      { user: user._id, title: 'Learn TypeScript', category: 'learning', targetValue: 100, currentValue: 65, unit: '%', color: '#6366f1' },
      { user: user._id, title: 'Get Promoted', category: 'career', targetValue: 100, currentValue: 40, unit: '%', color: '#f59e0b' },
    ]);

    const now = new Date();
    await Expense.insertMany([
      { user: user._id, title: 'Monthly Salary', amount: 5000, type: 'income', category: 'salary', date: now },
      { user: user._id, title: 'Grocery Shopping', amount: 150, type: 'expense', category: 'food', date: now },
      { user: user._id, title: 'Netflix Subscription', amount: 15, type: 'expense', category: 'entertainment', date: now },
      { user: user._id, title: 'Uber Ride', amount: 25, type: 'expense', category: 'transport', date: now },
      { user: user._id, title: 'Freelance Project', amount: 800, type: 'income', category: 'freelance', date: now },
      { user: user._id, title: 'Gym Membership', amount: 50, type: 'expense', category: 'health', date: now },
    ]);

    await Budget.insertMany([
      { user: user._id, name: 'Food Budget', category: 'food', amount: 500, spent: 150 },
      { user: user._id, name: 'Entertainment', category: 'entertainment', amount: 200, spent: 15 },
      { user: user._id, name: 'Transport', category: 'transport', amount: 300, spent: 25 },
    ]);

    await LearningResource.insertMany([
      { user: user._id, title: 'React - The Complete Guide', type: 'course', progress: 75, status: 'in-progress', category: 'web-dev', timeSpentMinutes: 1200 },
      { user: user._id, title: 'TypeScript Crash Course', type: 'youtube', url: 'https://youtube.com', progress: 100, status: 'completed', completedAt: new Date(), timeSpentMinutes: 180 },
      { user: user._id, title: 'System Design Notes', type: 'note', content: 'Key concepts: scalability, load balancing...', progress: 50, status: 'in-progress', timeSpentMinutes: 60 },
      { user: user._id, title: 'Clean Code', type: 'book', progress: 30, status: 'in-progress', timeSpentMinutes: 300 },
    ]);

    await Notification.insertMany([
      { user: user._id, title: 'Welcome to LifeOS!', message: 'Your personal life management platform is ready.', type: 'success', category: 'system' },
      { user: user._id, title: 'Task Due Tomorrow', message: 'Complete project proposal is due tomorrow.', type: 'reminder', category: 'task', link: '/planner' },
      { user: user._id, title: 'Budget Alert', message: 'Food budget is at 30% usage.', type: 'warning', category: 'expense', link: '/expenses' },
    ]);

    console.log('\n✅ Seed data created successfully!');
    console.log('📧 Email: demo@lifeos.app');
    console.log('🔑 Password: demo123');
    console.log(`📋 Tasks: ${tasks.length}`);
    console.log(`🎯 Habits: ${habits.length}`);
    console.log(`🏆 Goals: ${goals.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
