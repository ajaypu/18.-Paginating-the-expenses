const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const expenseController = require("../controllers/expense");
const auth = require("../middleware/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/download", auth.authenticate, expenseController.downloadExpense);

module.exports = router;
