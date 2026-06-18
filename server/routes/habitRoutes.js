const express = require('express');
const habitController = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/stats', habitController.getHabitStats);
router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);
router.put('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);
router.post('/:id/toggle', habitController.toggleCompletion);

module.exports = router;
