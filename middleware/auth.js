const jwt = require("jsonwebtoken");
const User = require("../models/user");
const express = require("express");

// const secretkeyy = process.env.TOKEN_SECRET;

exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      console.log(err);
      throw new Error(err);
    }
    if (user) {
      User.findByPk(user.userId).then((user) => {
        req.user = user;

        next();
      });
    } else {
      console.log("User not authenticated");
      throw new Error("User not authenticated");
    }
  });
};
