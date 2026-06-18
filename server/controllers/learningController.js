const LearningResource = require('../models/LearningResource');
const AppError = require('../utils/AppError');
const { asyncHandler, paginate } = require('../utils/helpers');

exports.getResources = asyncHandler(async (req, res) => {
  const { type, status, page, limit } = req.query;
  const filter = { user: req.user._id };
  if (type) filter.type = type;
  if (status) filter.status = status;

  const { skip, limit: l, page: p } = paginate(page, limit);
  const [resources, total] = await Promise.all([
    LearningResource.find(filter).sort('-updatedAt').skip(skip).limit(l),
    LearningResource.countDocuments(filter),
  ]);

  res.json({ success: true, data: { resources, pagination: { page: p, limit: l, total } } });
});

exports.createResource = asyncHandler(async (req, res) => {
  const resource = await LearningResource.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, message: 'Resource saved', data: { resource } });
});

exports.updateResource = asyncHandler(async (req, res) => {
  if (req.body.progress >= 100) {
    req.body.status = 'completed';
    req.body.completedAt = new Date();
  } else if (req.body.progress > 0) {
    req.body.status = 'in-progress';
  }

  const resource = await LearningResource.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!resource) throw new AppError('Resource not found', 404);
  res.json({ success: true, message: 'Resource updated', data: { resource } });
});

exports.deleteResource = asyncHandler(async (req, res) => {
  const resource = await LearningResource.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!resource) throw new AppError('Resource not found', 404);
  res.json({ success: true, message: 'Resource deleted' });
});

exports.getLearningAnalytics = asyncHandler(async (req, res) => {
  const resources = await LearningResource.find({ user: req.user._id });
  const byType = {};
  resources.forEach((r) => {
    byType[r.type] = (byType[r.type] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      total: resources.length,
      completed: resources.filter((r) => r.status === 'completed').length,
      inProgress: resources.filter((r) => r.status === 'in-progress').length,
      totalMinutes: resources.reduce((s, r) => s + r.timeSpentMinutes, 0),
      avgProgress: resources.length
        ? Math.round(resources.reduce((s, r) => s + r.progress, 0) / resources.length)
        : 0,
      byType: Object.entries(byType).map(([type, count]) => ({ type, count })),
    },
  });
});
