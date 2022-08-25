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
  jwt.verify(access_token, process.env.ACCESSTOKEN_SECRET, (err, decoded) => {
    if (err) {
      temp.query(
        "select refresh from members where id = ?",
        req.session.user_id,
        (err, result) => {}
      );
    }
  });
};

module.exports = middleware;
