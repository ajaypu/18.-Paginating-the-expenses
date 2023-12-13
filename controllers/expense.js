const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");

const UserServices = require("../services/userservices");
const S3Services = require("../services/S3services");

exports.downloadExpense = async (req, res, next) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);

    //It should depend upon the userid
    const userId = req.user.id;
    // const filename = "Expense.txt";
    const filename = `Expense${userId}/${new Date()}.txt`;

    const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "", success: false });
  }
};

exports.addExpense = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  const { amount, description, category } = req.body;

  if (
    amount === undefined ||
    description === undefined ||
    category === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Parameters missing" });
  }

  Expense.create(
    { amount, description, category, userId: req.user.id },
    { transaction: transaction }
  )

    .then(async (expense) => {
      await transaction.commit();
      // const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
      return res.status(201).json({ expense, success: true });
    })
    .catch(async (err) => {
      await transaction.rollback();
      return res.status(500).json({ success: false, error: err });
    });
};

exports.getExpenses = async (req, res, next) => {
  // Expense.findAll()
  const expenses = await Expense.findAll({ where: { userId: req.user.id } });
  const userDetails = await User.findByPk(req.user.id);
  // req.user
  //   .getExpenses()
  // ((expenses) => {
  return res.status(200).json({ expenses, success: true, userDetails });
  // })
};

exports.deleteExpense = (req, res, next) => {
  const exId = req.params.id;

  Expense.destroy({ where: { id: exId } })
    .then((response) => {
      res.status(203).json({ success: true, message: "Deleted Successfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};
