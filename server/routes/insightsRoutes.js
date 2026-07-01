const express = require('express');
const { getMonthlyInsights } = require('../controllers/insightsController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/monthly', authenticateToken, getMonthlyInsights);

module.exports = router;