const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const get = require("./router/get");
const post = require("./router/post");

app.use(express.static("cssandjs"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(get);
app.use(post);

app.get("/", (req, res) => {
  res.render("main");
  console.log(req.session);
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(process.env.PORT, () => {
  console.log("server on");
});
