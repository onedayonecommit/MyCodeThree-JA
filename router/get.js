const express = require("express");
const router = express.Router();
const session = require("express-session");
const Session = require("../config/session");
const jwt = require("jsonwebtoken");
const middleware = require("./tokenmiddleware");
const { application } = require("express");
router.use(session(Session));

/** 메인페이지 */
router.get("/", (req, res) => {
  res.render("start");
  console.log(req.session);
});

/** 로그인 페이지 = (1) */
router.get("/log", (req, res) => {
  res.render("login");
});

/** 회원가입 페이지 = (2) */
router.get("/join", (req, res) => {
  res.render("joinMember");
});

/** 비밀번호&이메일 찾기 페이지 = (3) */
router.get("/find", (req, res) => {
  res.render("find");
});

/** 비밀번호 재설정 페이지 = (4) */
router.get("/pwchange", middleware, (req, res) => {
  res.render("pwchange");
});

/** 이메일 찾기 페이지 = (3-1) */
router.get("/findEmail", (req, res) => {
  res.render("findEmail");
});

/** 회원가입 당시 저장한 세션 초기화 */
router.get("/deletesession", (req, res) => {
  req.session.destroy(() => {
    req.session;
  });
  res.redirect("/login");
});

/** 회원가입 페이지 */
router.get("/signup", (req, res) => {
  res.render("signup");
  console.log(req.session);
});

/** 로그인 페이지 */
router.get("/login", (req, res) => {
  console.log(req.session);
  jwt.verify(
    req.session.accesstoken,
    process.env.ACCESSTOKEN_SECRET,
    (err, decoded) => {
      console.log(decoded);
    }
  );
  res.render("login");
});

/** 로그인 후 페이지 */
router.get("/loginafter", middleware, (req, res) => {
  res.render("after");
});

router.get("/mypage", middleware, (req, res) => {
  res.render("mypage_edit");
});
module.exports = router;
