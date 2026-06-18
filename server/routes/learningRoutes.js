const express = require('express');
const learningController = require('../controllers/learningController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/analytics', learningController.getLearningAnalytics);
router.get('/', learningController.getResources);
router.post('/', learningController.createResource);
router.put('/:id', learningController.updateResource);
router.delete('/:id', learningController.deleteResource);

module.exports = router;
