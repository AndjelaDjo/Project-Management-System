const express = require('express');
const router = express.Router();
const { search } = require('../controllers/search.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/search', authenticateToken, search);

module.exports = router;
