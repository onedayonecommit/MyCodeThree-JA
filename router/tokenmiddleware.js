const express = require("express");
const session = require("express-session");
const Session = require("../config/session");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const router = express.Router();
router.use(session(Session));

let temp = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test99",
  password: process.env.DB_PASSWORD,
});

const middleware = (req, res, next) => {
  const { access_token, refresh_token } = req.session;
  if (jwt.verify(access_token, process.env.ACCESSTOKEN_SECRET)) {
    next();
  } else {
    temp.query(
      "select refresh from members where id = ?",
      req.session.user_email,
      (err, result) => {
        if (err) console.log(err);
        else if (result[0] == undefined) {
          res.send("tokenfail");
          // wntjr
        } else {
          if (jwt.verify(result[0].refresh, process.env.REFRESHTOKEN_SECRET)) {
            req.session.access_token = jwt.sign(
              {
                user_email: req.session.user_email,
              },
              process.env.ACCESSTOKEN_SECRET,
              {
                expiresIn: "15m",
                issuer: "gyeonghwan",
              }
            );
          }
        }
      }
    );
  }
};

module.exports = middleware;
