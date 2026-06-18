const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: {
      type: String,
      enum: [
        'salary', 'freelance', 'investment', 'food', 'transport', 'housing',
        'utilities', 'entertainment', 'health', 'education', 'shopping', 'other',
      ],
      default: 'other',
    },
    date: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'bank', 'upi', 'other'], default: 'card' },
    isRecurring: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
