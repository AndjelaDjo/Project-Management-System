const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const { uploadFile, deleteFile } = require('../controllers/file.controller');

router.post('/projects/:projectId/upload-file', authenticateToken, uploadFile);
router.delete('/projects/:projectId/files/:fileId', authenticateToken, deleteFile);

module.exports = router;
