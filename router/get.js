const express = require("express");
const router = express.Router();
const session = require("express-session");
const Session = require("../config/session");
router.use(session(Session));

// 회원가입 당시 저장한 세션 초기화
router.get("/deletesession", (req, res) => {
  req.session.destroy(() => {
    req.session;
  });
  res.redirect("/login");
});

// 회원가입 페이지
router.get("/signup", (req, res) => {
  res.render("signup");
  console.log(req.session);
});

// 로그인 페이지
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
