const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");

router.post("/AddExpense", expenseController.addExpense);

router.get("/getExpenses", expenseController.getExpenses);
router.delete("/deleteExpense/:id", expenseController.deleteExpense);

module.exports = router;
