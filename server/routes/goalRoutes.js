const express = require('express');
const goalController = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', goalController.getGoals);
router.post('/', goalController.createGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);
router.post('/:id/milestones', goalController.addMilestone);
router.patch('/:id/milestones/:milestoneId', goalController.toggleMilestone);

module.exports = router;
