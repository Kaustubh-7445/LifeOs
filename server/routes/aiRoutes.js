const express = require('express');
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/daily-suggestions', aiController.getDailySuggestions);
router.get('/weekly-summary', aiController.getWeeklySummary);
router.get('/goal-recommendations', aiController.getGoalRecommendations);
router.get('/learning-recommendations', aiController.getLearningRecommendations);
router.get('/task-prioritization', aiController.getTaskPrioritization);
router.get('/improvement-insights', aiController.getImprovementInsights);
router.post('/chat', aiController.chat);

module.exports = router;
