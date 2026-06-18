const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0 },
    period: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    alertThreshold: { type: Number, default: 80, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

budgetSchema.virtual('remaining').get(function () {
  return Math.max(0, this.amount - this.spent);
});

budgetSchema.virtual('percentUsed').get(function () {
  if (!this.amount) return 0;
  return Math.min(100, Math.round((this.spent / this.amount) * 100));
});

budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Budget', budgetSchema);
