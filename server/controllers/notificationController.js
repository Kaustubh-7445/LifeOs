const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const { asyncHandler, paginate } = require('../utils/helpers');

exports.getNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { skip, limit: l, page: p } = paginate(page, limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(l),
    Notification.countDocuments({ user: req.user._id }),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  res.json({
    success: true,
    data: { notifications, unreadCount, pagination: { page: p, limit: l, total } },
  });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new AppError('Notification not found', 404);
  res.json({ success: true, data: { notification } });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});
