const express = require('express');
const router = express.Router();
const { getDashboardNumbers, getRecentActivities } = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/dashboard-stats', authenticateToken, getDashboardNumbers);
router.get('/recent-activities', authenticateToken, getRecentActivities);

module.exports = router;
