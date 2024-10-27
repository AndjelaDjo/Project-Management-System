const express = require("express");
const router = express.Router();
const teamController = require("../controllers/team.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

router.get("/get-team", authenticateToken, teamController.getTeams);
router.delete("/delete-team/:teamId", authenticateToken, teamController.deleteTeam);
router.post("/add-team", authenticateToken, teamController.addTeam);
router.get('/search', authenticateToken, teamController.searchTeams);
router.get('/get-team/:teamId', authenticateToken, teamController.getTeamById);
router.put('/update-team/:teamId', authenticateToken, teamController.updateTeam);
router.get('/get-team-projects/:teamId', authenticateToken, teamController.getTeamProjects);

module.exports = router;
