const Goal = require('../models/Goal');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../utils/helpers');

exports.getGoals = asyncHandler(async (req, res) => {
  const { category, status } = req.query;
  const filter = { user: req.user._id };
  if (category) filter.category = category;
  if (status) filter.status = status;

  const goals = await Goal.find(filter).sort('-createdAt');
  res.json({ success: true, data: { goals } });
});

exports.createGoal = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  delete payload.user;
  const goal = await Goal.create({ ...payload, user: req.user._id });
  res.status(201).json({ success: true, message: 'Goal created', data: { goal } });
});

exports.updateGoal = asyncHandler(async (req, res) => {
  const existingGoal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!existingGoal) throw new AppError('Goal not found', 404);

  const updates = { ...req.body };
  delete updates.user;

  const effectiveTarget = updates.targetValue !== undefined ? updates.targetValue : existingGoal.targetValue;
  const effectiveCurrent = updates.currentValue !== undefined ? updates.currentValue : existingGoal.currentValue;

  if (effectiveTarget > 0 && effectiveCurrent >= effectiveTarget) {
    if (existingGoal.status !== 'completed') {
      updates.status = 'completed';
      updates.completedAt = new Date();
    }
  } else if (existingGoal.status === 'completed' && effectiveCurrent < effectiveTarget) {
    updates.status = 'active';
    updates.completedAt = null;
  }

  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );
  res.json({ success: true, message: 'Goal updated', data: { goal } });
});

exports.deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new AppError('Goal not found', 404);
  res.json({ success: true, message: 'Goal deleted' });
});

exports.addMilestone = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new AppError('Goal not found', 404);
  goal.milestones.push(req.body);
  await goal.save();
  res.status(201).json({ success: true, message: 'Milestone added', data: { goal } });
});

exports.toggleMilestone = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new AppError('Goal not found', 404);

  const milestone = goal.milestones.id(req.params.milestoneId);
  if (!milestone) throw new AppError('Milestone not found', 404);

  milestone.completed = !milestone.completed;
  milestone.completedAt = milestone.completed ? new Date() : undefined;
  await goal.save();
  res.json({ success: true, message: 'Milestone updated', data: { goal } });
});
