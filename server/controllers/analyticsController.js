const { getDashboardStats, getAnalyticsData } = require('../services/analyticsService');
const { asyncHandler } = require('../utils/helpers');

exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user._id);
  res.json({ success: true, data: stats });
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  const { period = 'monthly' } = req.query;
  const data = await getAnalyticsData(req.user._id, period);
  res.json({ success: true, data });
});
