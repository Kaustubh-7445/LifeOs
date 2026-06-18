const Task = require('../models/Task');
const Goal = require('../models/Goal');
const LearningResource = require('../models/LearningResource');
const {
  generateAIResponse,
  getDailySuggestions,
  getWeeklySummary,
  getGoalRecommendations,
  getLearningRecommendations,
  getTaskPrioritization,
  getImprovementInsights,
} = require('../services/aiService');
const { getAnalyticsData } = require('../services/analyticsService');
const { asyncHandler } = require('../utils/helpers');

exports.getDailySuggestions = asyncHandler(async (req, res) => {
  const [tasks, goals, learning] = await Promise.all([
    Task.find({ user: req.user._id, status: { $ne: 'done' } }).limit(10),
    Goal.find({ user: req.user._id, status: 'active' }).limit(5),
    LearningResource.find({ user: req.user._id, status: { $ne: 'completed' } }).limit(5),
  ]);

  const result = await getDailySuggestions({ tasks, goals, learning });
  res.json({ success: true, data: result });
});

exports.getWeeklySummary = asyncHandler(async (req, res) => {
  const analytics = await getAnalyticsData(req.user._id, 'weekly');
  const result = await getWeeklySummary(analytics);
  res.json({ success: true, data: result });
});

exports.getGoalRecommendations = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id, status: 'active' });
  const result = await getGoalRecommendations(goals);
  res.json({ success: true, data: result });
});

exports.getLearningRecommendations = asyncHandler(async (req, res) => {
  const resources = await LearningResource.find({ user: req.user._id });
  const result = await getLearningRecommendations(resources);
  res.json({ success: true, data: result });
});

exports.getTaskPrioritization = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id, status: { $ne: 'done' } });
  const result = await getTaskPrioritization(tasks.map((t) => ({
    id: t._id,
    title: t.title,
    priority: t.priority,
    dueDate: t.dueDate,
    category: t.category,
  })));
  res.json({ success: true, data: result });
});

exports.getImprovementInsights = asyncHandler(async (req, res) => {
  const analytics = await getAnalyticsData(req.user._id, 'monthly');
  const result = await getImprovementInsights(analytics);
  res.json({ success: true, data: result });
});

exports.chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const AppError = require('../utils/AppError');
  if (!message) throw new AppError('Message is required', 400);

  const [tasks, goals] = await Promise.all([
    Task.find({ user: req.user._id, status: { $ne: 'done' } }).limit(5),
    Goal.find({ user: req.user._id, status: 'active' }).limit(3),
  ]);

  const taskList = tasks.map((t) => `- ${t.title} (Priority: ${t.priority})`).join('\n') || 'No active tasks';
  const goalList = goals.map((g) => `- ${g.title} (${g.currentValue}/${g.targetValue} ${g.unit || ''})`).join('\n') || 'No active goals';

  const context = `Active Tasks for User:\n${taskList}\n\nActive Goals for User:\n${goalList}`;
  
  const result = await generateAIResponse(message, context);
  res.json({ success: true, data: result });
});
