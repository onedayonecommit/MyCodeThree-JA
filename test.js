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
app.get("/", (req, res) => {
  jwt.verify(
    req.session.token,
    process.env.ACCESSTOKEN_SECRET,
    (err, decoded) => {
      try {
        console.log(decoded);
        res.send("없다");
      } catch (err) {
        console.log(err);
        res.send("틀림");
      }
    }
  );
});
