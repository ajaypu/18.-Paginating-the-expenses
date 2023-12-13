require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const uuid = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const ForgotPassword = require("../models/forgotPassword");

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const API_KEY = process.env.SENDGRID_API_KEY;

    const user = await User.findOne({ where: { email: email } });
    console.log(user);

    if (user) {
      const id = uuid.v4();
      console.log(id);
      user
        .ForgotPassword({
          where: { id: id, active: true },
        })
        .then((user) => {
          console.log(user);
        })
        .catch((err) => {
          console.log(err);
        });

      sgMail.setApiKey(API_KEY);

      const message = {
        to: email,
        from: "ajaypp25@gmail.com",
        subject: "Forgot Password",
        text: "Hello From SendGrid",
        html: `<a href="http://localhost:3000/password/resetPassword/${id}">Reset password</a>`,
      };

      sgMail
        .send(message)
        .then((response) => {
          console.log(response);
          return res.status(response[0].statusCode).json({
            message: "Link to reset password sent to your mail ",
            sucess: true,
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, sucess: false });
  }
};

exports.resetPassword = (req, res, next) => {
  const id = req.params.id;

  ForgotPassword.findOne({ where: { id: id } }).then(
    (forgotPasswordRequest) => {
      if (forgotPasswordRequest) {
        forgotPasswordRequest.update({ active: false });

        res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatePassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required />
                                        <button>reset password</button>
                                    </form>
                                </html>`);
        res.end();
      }
    }
  );
};

exports.updatePassword = (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const { id } = req.params;
    forgotPassword
      .findOne({ where: { id: resetpasswordid } })
      .then((resetPasswordRequest) => {
        User.findOne({ where: { id: resetPasswordRequest.userId } }).then(
          (user) => {
            console.log("User Details", user);

            if (user) {
              //encrypt the password
              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }

                bcrypt.hash(newpassword, saltRounds, function (err, salt) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      });
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};
