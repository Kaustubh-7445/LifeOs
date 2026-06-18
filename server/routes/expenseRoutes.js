const express = require('express');
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/report', expenseController.getFinancialReport);
router.get('/budgets', expenseController.getBudgets);
router.post('/budgets', expenseController.createBudget);
router.put('/budgets/:id', expenseController.updateBudget);
router.delete('/budgets/:id', expenseController.deleteBudget);
router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
