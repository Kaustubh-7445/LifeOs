const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    period: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'daily' },
    productivityScore: { type: Number, default: 0, min: 0, max: 100 },
    tasksCompleted: { type: Number, default: 0 },
    tasksCreated: { type: Number, default: 0 },
    habitsCompleted: { type: Number, default: 0 },
    habitsTotal: { type: Number, default: 0 },
    goalsProgress: { type: Number, default: 0 },
    totalIncome: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    learningMinutes: { type: Number, default: 0 },
    learningResourcesCompleted: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

analyticsSchema.index({ user: 1, date: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
