const jwt = require("jsonwebtoken");
const session = require("express-session");
const Session = require("./config/session");
const express = require("express");
const app = express();
const dot = require("dotenv").config();
app.use(session(Session));
app.listen(8080, () => {
  console.log("server on");
});

app.get("/token", (req, res) => {
  req.session.token = jwt.sign(
    {
      userid: "headsfjdsf",
    },
    process.env.ACCESSTOKEN_SECRET,
    {
      expiresIn: "5s",
      issuer: "gyeonghwan",
    }
  );
  res.redirect("/");
});

app.get("/", (req, res) => {
  console.log(req.session.token);
  try {
    jwt.verify(req.session.token, process.env.ACCESSTOKEN_SECRET);
    res.send("suc");
  } catch (error) {
    res.send("fail");
  }
});
