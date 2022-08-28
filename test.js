const jwt = require("jsonwebtoken");
const session = require("express-session");
const Session = require("./config/session");
const express = require("express");
const app = express();
const dot = require("dotenv").config();
const middleware = require("./router/tokenmiddleware");
app.use(session(Session));
app.listen(8080, () => {
  console.log("server on");
});

app.get("/token", (req, res) => {
  req.session.accesstoken = jwt.sign(
    {
      userid: "headsfjdsf",
    },
    process.env.ACCESSTOKEN_SECRET,
    {
      expiresIn: "10s",
      issuer: "gyeonghwan",
    }
  );
  res.redirect("/");
});

app.get("/loginafter", middleware, (req, res) => {
  res.send("로그인 완료된 사용자");
});

app.get("/tokencheck", (req, res) => {
  jwt.verify(
    req.session.token,
    process.env.ACCESSTOKEN_SECRET,
    (err, decoded) => {
      console.log(decoded.userid);
    }
  );
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
