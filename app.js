const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const errController = require("./controllers/error");
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");

app.use(cors());

//Databse
const sequelize = require("./util/database");
const Expense = require("./models/expense");
const User = require("./models/user");
const Order = require("./models/order");
const ForgotPassword = require("./models/forgotPassword");

const userAuth = require("./middleware/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
// app.use(userAuth.authenticate);
app.use("/expense", userAuth.authenticate, expenseRouter);
app.use("/purchase", userAuth.authenticate, purchaseRouter);
app.use("/premium", premiumRouter);
app.use("/password", passwordRouter);
app.use(errController.error404);

// // Associations
User.hasMany(Expense); // Relation btw User and Expense
Expense.belongsTo(User);

User.hasMany(Order); // Relation btw User and Order
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    console.log("Database Connected Succesfully");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
