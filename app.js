const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const config = require("./config/config");
const app = express();

app.use(express.static("cssandjs"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("signup");
});

app.listen(process.env.PORT, () => {
  console.log("server on");
});
