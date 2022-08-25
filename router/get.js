const express = require("express");
const router = express.Router();
const session = require("express-session");
const Session = require("../config/session");
router.use(session(Session));
router.get("/deletesession", (req, res) => {
  req.session.destroy(() => {
    req.session;
  });
  res.redirect("/login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
  console.log(req.session);
});
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
