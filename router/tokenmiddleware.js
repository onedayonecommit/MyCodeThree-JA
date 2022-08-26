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

/**토큰 유효성 검사 미들웨어 */
const middleware = (req, res, next) => {
  const { access_token, refresh_token } = req.session;
  jwt.verify(access_token, process.env.ACCESSTOKEN_SECRET, (err, decoded) => {
    if (err) res.send("tokenfail");
    else {
      temp.query(
        "select refresh from members where id = ?",
        req.session.user_id,
        (err, result) => {
          if (result[0] == undefined) {
            res.send("nottoken");
          } else if (result[0] != undefined) {
            jwt.verify(
              result[0].refresh,
              process.env.REFRESHTOKEN_SECRET,
              (err, decoded) => {
                if (err) res.send("nottoken");
                else next();
              }
            );
          }
        }
      );
    }
  });
};

module.exports = middleware;
