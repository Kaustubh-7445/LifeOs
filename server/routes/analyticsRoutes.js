const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/', analyticsController.getAnalytics);

module.exports = router;
