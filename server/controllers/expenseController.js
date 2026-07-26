const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const AppError = require('../utils/AppError');
const { asyncHandler, paginate } = require('../utils/helpers');

const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

const syncBudgetSpent = async (userId, categories) => {
  const catList = Array.isArray(categories) ? categories : [categories];
  const uniqueCats = Array.from(new Set(catList.filter(Boolean)));
  if (uniqueCats.length === 0) return;

  for (const category of uniqueCats) {
    const budgets = await Budget.find({ user: userId, category, isActive: true });
    if (!budgets.length) continue;

    const totalExpense = await Expense.aggregate([
      { $match: { user: userId, category, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const spentAmount = totalExpense[0] ? totalExpense[0].total : 0;

    await Budget.updateMany(
      { user: userId, category, isActive: true },
      { $set: { spent: spentAmount } }
    );
  }
};

exports.getExpenses = asyncHandler(async (req, res) => {
  const { type, category, month, year, page, limit } = req.query;
  const filter = { user: req.user._id };
  if (type) filter.type = type;
  if (category) filter.category = category;

  if (month && year) {
    const m = parseInt(month, 10) - 1;
    const y = parseInt(year, 10);
    filter.date = { $gte: startOfMonth(new Date(y, m)), $lte: endOfMonth(new Date(y, m)) };
  }

  const { skip, limit: l, page: p } = paginate(page, limit);
  const [expenses, total] = await Promise.all([
    Expense.find(filter).sort('-date').skip(skip).limit(l),
    Expense.countDocuments(filter),
  ]);

  res.json({ success: true, data: { expenses, pagination: { page: p, limit: l, total } } });
});

exports.createExpense = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  delete payload.user;
  const expense = await Expense.create({ ...payload, user: req.user._id });

  await syncBudgetSpent(req.user._id, expense.category);

  res.status(201).json({ success: true, message: 'Transaction created', data: { expense } });
});

exports.updateExpense = asyncHandler(async (req, res) => {
  const existing = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!existing) throw new AppError('Transaction not found', 404);

  const updates = { ...req.body };
  delete updates.user;

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  await syncBudgetSpent(req.user._id, [existing.category, expense.category]);

  res.json({ success: true, message: 'Transaction updated', data: { expense } });
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) throw new AppError('Transaction not found', 404);

  await syncBudgetSpent(req.user._id, expense.category);

  res.json({ success: true, message: 'Transaction deleted' });
});

exports.getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id }).sort('-createdAt');
  const alerts = budgets.filter((b) => b.percentUsed >= b.alertThreshold);
  res.json({ success: true, data: { budgets, alerts } });
});

exports.createBudget = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  delete payload.user;
  const budget = await Budget.create({ ...payload, user: req.user._id });

  await syncBudgetSpent(req.user._id, budget.category);
  const updatedBudget = await Budget.findById(budget._id);

  res.status(201).json({ success: true, message: 'Budget created', data: { budget: updatedBudget || budget } });
});

exports.updateBudget = asyncHandler(async (req, res) => {
  const existing = await Budget.findOne({ _id: req.params.id, user: req.user._id });
  if (!existing) throw new AppError('Budget not found', 404);

  const updates = { ...req.body };
  delete updates.user;

  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  await syncBudgetSpent(req.user._id, [existing.category, budget.category]);
  const updatedBudget = await Budget.findById(budget._id);

  res.json({ success: true, message: 'Budget updated', data: { budget: updatedBudget || budget } });
});

exports.deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) throw new AppError('Budget not found', 404);
  res.json({ success: true, message: 'Budget deleted' });
});

exports.getFinancialReport = asyncHandler(async (req, res) => {
  const { period = 'monthly' } = req.query;
  const now = new Date();
  let startDate = startOfMonth(now);

  if (period === 'yearly') startDate = new Date(now.getFullYear(), 0, 1);
  if (period === 'weekly') {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
  }

  const expenses = await Expense.find({ user: req.user._id, date: { $gte: startDate } });
  const income = expenses.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenses.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

  const byCategory = {};
  expenses.filter((e) => e.type === 'expense').forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  res.json({
    success: true,
    data: {
      income,
      expenses: totalExpenses,
      savings: income - totalExpenses,
      byCategory: Object.entries(byCategory).map(([category, amount]) => ({ category, amount })),
      transactions: expenses.length,
    },
  });
});
