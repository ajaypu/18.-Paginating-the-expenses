const mysql = require("mysql2");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("et-node", "root", "Ajay123sql", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
