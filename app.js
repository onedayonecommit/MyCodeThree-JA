const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.static("cssandjs"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: false }));

mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.listen(process.env.PORT, () => {
  console.log("server on");
});
