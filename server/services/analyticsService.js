const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const Expense = require('../models/Expense');
const LearningResource = require('../models/LearningResource');
const Analytics = require('../models/Analytics');

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

const computeProductivityScore = ({ tasksCompleted, tasksTotal, habitsCompleted, habitsTotal, goalsProgress }) => {
  const taskScore = tasksTotal ? (tasksCompleted / tasksTotal) * 40 : 20;
  const habitScore = habitsTotal ? (habitsCompleted / habitsTotal) * 30 : 15;
  const goalScore = (goalsProgress / 100) * 30;
  return Math.round(Math.min(100, taskScore + habitScore + goalScore));
};

const getDashboardStats = async (userId) => {
  const today = startOfDay();
  const todayEnd = endOfDay();
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();

  const [tasks, habits, goals, monthExpenses, learning, recentTasks] = await Promise.all([
    Task.find({ user: userId }),
    Habit.find({ user: userId, isActive: true }),
    Goal.find({ user: userId, status: 'active' }),
    Expense.find({ user: userId, date: { $gte: monthStart, $lte: monthEnd } }),
    LearningResource.find({ user: userId }),
    Task.find({ user: userId }).sort('-updatedAt').limit(5),
  ]);

  const tasksCompletedToday = tasks.filter(
    (t) => t.status === 'done' && t.completedAt && t.completedAt >= today && t.completedAt <= todayEnd
  ).length;
  const tasksTotal = tasks.filter((t) => t.status !== 'done').length + tasksCompletedToday;

  let habitsCompletedToday = 0;
  habits.forEach((h) => {
    const done = h.completions.some(
      (c) => c.completed && c.date >= today && c.date <= todayEnd
    );
    if (done) habitsCompletedToday++;
  });

  const goalsProgress = goals.length
    ? goals.reduce((sum, g) => sum + (g.targetValue ? (g.currentValue / g.targetValue) * 100 : 0), 0) / goals.length
    : 0;

  const income = monthExpenses.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const expenses = monthExpenses.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const learningProgress = learning.length
    ? learning.reduce((s, l) => s + l.progress, 0) / learning.length
    : 0;

  const productivityScore = computeProductivityScore({
    tasksCompleted: tasksCompletedToday,
    tasksTotal: Math.max(tasksTotal, 1),
    habitsCompleted: habitsCompletedToday,
    habitsTotal: Math.max(habits.length, 1),
    goalsProgress,
  });

  return {
    productivityScore,
    dailySummary: {
      tasksCompleted: tasksCompletedToday,
      tasksPending: tasks.filter((t) => t.status !== 'done').length,
      habitsCompleted: habitsCompletedToday,
      habitsTotal: habits.length,
    },
    goalProgress: Math.round(goalsProgress),
    habitCompletionRate: habits.length ? Math.round((habitsCompletedToday / habits.length) * 100) : 0,
    monthlyExpenses: { income, expenses, savings: income - expenses },
    learningProgress: Math.round(learningProgress),
    recentActivity: recentTasks.map((t) => ({
      id: t._id,
      type: 'task',
      title: t.title,
      status: t.status,
      updatedAt: t.updatedAt,
    })),
    goals: goals.slice(0, 5).map((g) => ({
      id: g._id,
      title: g.title,
      progress: g.progress,
      category: g.category,
      color: g.color,
    })),
  };
};

const getAnalyticsData = async (userId, period = 'monthly') => {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'weekly':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = startOfMonth(now);
  }

  const [tasks, habits, goals, expenses, learning] = await Promise.all([
    Task.find({ user: userId, createdAt: { $gte: startDate } }),
    Habit.find({ user: userId }),
    Goal.find({ user: userId }),
    Expense.find({ user: userId, date: { $gte: startDate } }),
    LearningResource.find({ user: userId }),
  ]);

  const tasksByStatus = ['todo', 'in-progress', 'review', 'done'].map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
  }));

  const expenseByCategory = {};
  expenses.filter((e) => e.type === 'expense').forEach((e) => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });

  const habitStats = habits.map((h) => ({
    name: h.name,
    streak: h.streak,
    bestStreak: h.bestStreak,
    completionRate: h.completions.length
      ? Math.round((h.completions.filter((c) => c.completed).length / h.completions.length) * 100)
      : 0,
  }));

  const learningByType = {};
  learning.forEach((l) => {
    learningByType[l.type] = (learningByType[l.type] || 0) + 1;
  });

  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mStart = startOfMonth(d);
    const mEnd = endOfMonth(d);
    const monthExp = expenses.filter((e) => e.date >= mStart && e.date <= mEnd);
    monthlyTrend.push({
      month: d.toLocaleString('default', { month: 'short' }),
      income: monthExp.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0),
      expenses: monthExp.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
    });
  }

  return {
    period,
    productivity: {
      tasksCreated: tasks.length,
      tasksCompleted: tasks.filter((t) => t.status === 'done').length,
      completionRate: tasks.length
        ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
        : 0,
      tasksByStatus,
    },
    goals: {
      total: goals.length,
      active: goals.filter((g) => g.status === 'active').length,
      completed: goals.filter((g) => g.status === 'completed').length,
      avgProgress: goals.length
        ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
        : 0,
    },
    habits: { total: habits.length, stats: habitStats },
    expenses: {
      totalIncome: expenses.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0),
      totalExpenses: expenses.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
      byCategory: Object.entries(expenseByCategory).map(([category, amount]) => ({ category, amount })),
      monthlyTrend,
    },
    learning: {
      total: learning.length,
      completed: learning.filter((l) => l.status === 'completed').length,
      totalMinutes: learning.reduce((s, l) => s + l.timeSpentMinutes, 0),
      byType: Object.entries(learningByType).map(([type, count]) => ({ type, count })),
      avgProgress: learning.length
        ? Math.round(learning.reduce((s, l) => s + l.progress, 0) / learning.length)
        : 0,
    },
  };
};

const recordDailyAnalytics = async (userId) => {
  const stats = await getDashboardStats(userId);
  const today = startOfDay();

  await Analytics.findOneAndUpdate(
    { user: userId, date: today, period: 'daily' },
    {
      productivityScore: stats.productivityScore,
      tasksCompleted: stats.dailySummary.tasksCompleted,
      habitsCompleted: stats.dailySummary.habitsCompleted,
      habitsTotal: stats.dailySummary.habitsTotal,
      goalsProgress: stats.goalProgress,
      totalIncome: stats.monthlyExpenses.income,
      totalExpenses: stats.monthlyExpenses.expenses,
    },
    { upsert: true, new: true }
  );
};

module.exports = {
  getDashboardStats,
  getAnalyticsData,
  recordDailyAnalytics,
  computeProductivityScore,
};
