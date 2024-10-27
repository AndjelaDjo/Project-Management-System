const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/get-projects', authenticateToken, projectController.getProjects);
router.post('/add-project', authenticateToken, projectController.addProject);
router.delete('/delete-project/:id', authenticateToken, projectController.deleteProject);
router.get('/project-details/:id', authenticateToken, projectController.getProjectDetails);
router.get('/projects/:id', projectController.getProjectById);
router.put('/update-project/:projectId', authenticateToken, projectController.updateProject);

module.exports = router;
