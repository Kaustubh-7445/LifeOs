const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const { asyncHandler, paginate } = require('../utils/helpers');

exports.getTasks = asyncHandler(async (req, res) => {
  const { status, category, priority, page, limit } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;

  const { skip, limit: l, page: p } = paginate(page, limit);
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort('order createdAt').skip(skip).limit(l),
    Task.countDocuments(filter),
  ]);

  res.json({ success: true, data: { tasks, pagination: { page: p, limit: l, total } } });
});

exports.getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, data: { task } });
});

exports.createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, message: 'Task created', data: { task } });
});

exports.updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new AppError('Task not found', 404);

  if (req.body.status === 'done' && task.status !== 'done') {
    req.body.completedAt = new Date();
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, message: 'Task updated', data: { task } });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, message: 'Task deleted' });
});

exports.reorderTasks = asyncHandler(async (req, res) => {
  const { tasks } = req.body;
  if (!Array.isArray(tasks)) throw new AppError('Tasks array required', 400);

  await Promise.all(
    tasks.map(({ id, status, order }) =>
      Task.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { status, order },
        { new: true }
      )
    )
  );

  const updated = await Task.find({ user: req.user._id }).sort('order');
  res.json({ success: true, message: 'Tasks reordered', data: { tasks: updated } });
});

exports.getCalendarTasks = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const m = parseInt(month || new Date().getMonth() + 1, 10) - 1;
  const y = parseInt(year || new Date().getFullYear(), 10);
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0, 23, 59, 59);

  const tasks = await Task.find({
    user: req.user._id,
    dueDate: { $gte: start, $lte: end },
  }).sort('dueDate');

  res.json({ success: true, data: { tasks } });
});
