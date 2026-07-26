const Habit = require('../models/Habit');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../utils/helpers');

const updateStreak = (habit) => {
  if (!habit.completions || habit.completions.length === 0) {
    habit.streak = 0;
    return;
  }

  const completedDates = Array.from(
    new Set(
      habit.completions
        .filter((c) => c.completed)
        .map((c) => {
          const d = new Date(c.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
    )
  ).sort((a, b) => b - a);

  if (completedDates.length === 0) {
    habit.streak = 0;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayTime = yesterday.getTime();

  const latestTime = completedDates[0];

  if (latestTime !== todayTime && latestTime !== yesterdayTime) {
    habit.streak = 0;
    return;
  }

  let currentExpected = new Date(latestTime);
  let streak = 0;

  for (const time of completedDates) {
    if (time === currentExpected.getTime()) {
      streak++;
      currentExpected.setDate(currentExpected.getDate() - 1);
    } else if (time < currentExpected.getTime()) {
      break;
    }
  }

  habit.streak = streak;
  if (streak > habit.bestStreak) {
    habit.bestStreak = streak;
  }
};

exports.getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: { habits } });
});

exports.createHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, message: 'Habit created', data: { habit } });
});

exports.updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!habit) throw new AppError('Habit not found', 404);
  res.json({ success: true, message: 'Habit updated', data: { habit } });
});

exports.deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!habit) throw new AppError('Habit not found', 404);
  res.json({ success: true, message: 'Habit deleted' });
});

exports.toggleCompletion = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) throw new AppError('Habit not found', 404);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const existingIdx = habit.completions.findIndex(
    (c) => c.date >= today && c.date <= todayEnd
  );

  if (existingIdx >= 0) {
    habit.completions[existingIdx].completed = !habit.completions[existingIdx].completed;
  } else {
    habit.completions.push({ date: new Date(), completed: true, notes: req.body.notes || '' });
  }

  updateStreak(habit);
  await habit.save();
  res.json({ success: true, message: 'Habit updated', data: { habit } });
});

exports.getHabitStats = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id });
  const stats = habits.map((h) => ({
    id: h._id,
    name: h.name,
    streak: h.streak,
    bestStreak: h.bestStreak,
    totalCompletions: h.completions.filter((c) => c.completed).length,
    completionRate: h.completions.length
      ? Math.round((h.completions.filter((c) => c.completed).length / h.completions.length) * 100)
      : 0,
  }));
  res.json({ success: true, data: { stats } });
});
