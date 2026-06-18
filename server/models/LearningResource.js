const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['course', 'youtube', 'article', 'note', 'book', 'other'], required: true },
    url: { type: String, default: '' },
    description: { type: String, default: '' },
    content: { type: String, default: '' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
    category: { type: String, default: 'general' },
    tags: [{ type: String }],
    timeSpentMinutes: { type: Number, default: 0 },
    completedAt: { type: Date },
    rating: { type: Number, min: 1, max: 5 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningResource', learningResourceSchema);
