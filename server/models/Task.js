const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['work', 'personal', 'health', 'learning', 'finance', 'other'],
      default: 'personal',
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
    dueDate: { type: Date },
    completedAt: { type: Date },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    estimatedMinutes: { type: Number },
    actualMinutes: { type: Number },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, status: 1, category: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
