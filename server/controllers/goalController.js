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
  const goal = await Goal.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, message: 'Goal created', data: { goal } });
});

exports.updateGoal = asyncHandler(async (req, res) => {
  let goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new AppError('Goal not found', 404);

  if (req.body.currentValue >= goal.targetValue && goal.status !== 'completed') {
    req.body.status = 'completed';
    req.body.completedAt = new Date();
  }

  goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
