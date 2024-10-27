const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

router.get("/get-task", authenticateToken, taskController.getTasks);
router.post("/add-task", authenticateToken, taskController.addTask);
router.delete("/delete-task/:taskId", authenticateToken, taskController.deleteTask);
router.get("/search", authenticateToken, taskController.searchTasks);
router.put('/edit-task/:taskId', authenticateToken, taskController.editTask);
router.get('/task-details/:id', authenticateToken, taskController.getTaskDetails);
router.put('/update-task/:taskId', authenticateToken, taskController.updateTask);

router.post('/:taskId/comments', authenticateToken, taskController.addComment); 
router.get('/:taskId/comments', authenticateToken, taskController.getComments); 


module.exports = router;
