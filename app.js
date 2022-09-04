const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const get = require("./router/get");
const post = require("./router/post");
const { sequelize } = require("./models/index");
app.use(express.static("cssandjs"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(get);
app.use(post);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(process.env.PORT, () => {
  console.log("server on");
});
