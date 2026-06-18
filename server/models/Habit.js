const mongoose = require('mongoose');

const habitCompletionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  completed: { type: Boolean, default: true },
  notes: { type: String, default: '' },
});

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🎯' },
    color: { type: String, default: '#6366f1' },
    frequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
    targetDays: [{ type: Number, min: 0, max: 6 }],
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    completions: [habitCompletionSchema],
    isActive: { type: Boolean, default: true },
    reminderTime: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
