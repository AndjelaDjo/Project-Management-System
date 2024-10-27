const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

router.post("/create-account", userController.createAccount);
router.post("/login", userController.login);
router.get("/get-user", authenticateToken, userController.getUser);
router.get('/search', userController.searchUsers);

module.exports = router;
