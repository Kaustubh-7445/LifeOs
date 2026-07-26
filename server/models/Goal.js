const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  targetDate: { type: Date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['fitness', 'career', 'financial', 'learning', 'personal', 'other'],
      required: true,
    },
    targetValue: { type: Number, default: 100 },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, default: '%' },
    deadline: { type: Date },
    milestones: [milestoneSchema],
    status: { type: String, enum: ['active', 'completed', 'paused', 'abandoned'], default: 'active' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    color: { type: String, default: '#8b5cf6' },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

goalSchema.virtual('progress').get(function () {
  if (!this.targetValue) return 0;
  return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });
goalSchema.index({ user: 1, status: 1, category: 1 });

module.exports = mongoose.model('Goal', goalSchema);
