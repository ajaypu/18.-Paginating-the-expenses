const Expense = require("../models/expense");
const User = require("../models/user");

const Sequelize = require("sequelize");

exports.getPremium = async (req, res, next) => {
  const results = await User.findAll({
    attributes: [
      "id",
      "name",
      [
        Sequelize.fn(
          "COALESCE",
          Sequelize.fn("SUM", Sequelize.col("Expenses.amount")),
          0
        ),
        "totalExpense",
      ],
    ],
    include: [
      {
        model: Expense,
        attributes: [],
      },
    ],
    group: ["User.id"],
    order: [[Sequelize.literal("totalExpense"), "DESC"]],
  });

  return res.status(200).json({ success: true, results });
};
