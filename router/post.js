const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Session = require("../config/session");
const router = express.Router();
const mailer = require("./mailer");
const randomauth = require("./randomauth");
const jwt = require("jsonwebtoken");
router.use(session(Session));

const temp = mysql.createConnection({
  user: "root",
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: "test99",
});

/**  로그인 요청 처리하는 곳 */
router.post("/login", (req, res) => {
  temp.query(
    "select pw from members where id = ?",
    req.body.id,
    (err, result) => {
      if (result[0] == undefined) res.send("noneid");
      else if (
        result[0] != undefined &&
        bcrypt.compareSync(req.body.pw, result[0].pw)
      ) {
        req.session.accesstoken = jwt.sign(
          {
            user_id: req.body.id,
          },
          process.env.ACCESSTOKEN_SECRET,
          {
            expiresIn: "15m",
            issuer: "gyeonghwan",
          }
        );
        const refreshtoken = jwt.sign(
          {
            user_id: req.body.id,
          },
          process.env.ACCESSTOKEN_SECRET,
          {
            expiresIn: "1h",
            issuer: "gyeonghwan",
          }
        );
        req.session.refreshtoken = refreshtoken;
        temp.query("update members set refresh = ? where id = ?", [
          refreshtoken,
          req.body.id,
        ]);
        res.send("suc");
      } else if (!bcrypt.compareSync(req.body.pw, result[0].pw)) {
        res.send("fail");
      }
    }
  );
});

/** 이메일 인증 하는 곳 */
router.post("/email", (req, res) => {
  const { email } = req.body;
  const authnumber = randomauth.randomfunc();
  // req.session.authnumber = bcrypt.hashSync(authnumber, 10);
  temp.query("select * from members where email = ?", email, (err, result) => {
    if (err) {
      console.log("qserr", err);
    } else if (result[0] == undefined) {
      req.session.emailtoken = jwt.sign(
        {
          user_email: email,
        },
        process.env.ACCESSTOKEN_SECRET,
        {
          expiresIn: "5m",
          issuer: "gyeonghwan",
        }
      );
      req.session.user_email = email;
      let sendmail = {
        toEmail: email,
        subject: `안녕하세요 내코석 이메일 인증번호 입니다.`,
        text: `${email} 님 반갑습니다. 이메일 인증번호는 <h1>${authnumber}</h1> 입니다. 인증번호 칸에 입력 후 인증 확인 부탁드립니다.`,
      };
      mailer.sendmail(sendmail);
      req.session.mailauth = authnumber;
      res.send("suc");
    } else if (result[0] != undefined) {
      res.send("fail");
    } else {
      res.send("failed");
    }
  });
});

/** 이메일 인증번호 확인 하는 곳 */
router.post("/authcheck", (req, res) => {
  let authnumber = req.body.authnumber;
  if (
    req.session.mailauth == authnumber &&
    jwt.verify(req.session.emailtoken, process.env.ACCESSTOKEN_SECRET)
  )
    res.send("suc");
  else res.send("fail");
});

/** 아이디 중복 확인 하는 곳 */
router.post("/idcheck", (req, res) => {
  temp.query(
    "select id from members where id = ?",
    req.body.id,
    (err, result) => {
      if (err) console.log(err);
      else if (result[0] == undefined) {
        req.session.user_id = req.body.id;
        res.send("suc");
      } else res.send("fail");
    }
  );
});

/** 회원가입 요청 처리하는 곳*/
router.post("/signup", (req, res) => {
  let { id, pw, email, authnumber } = req.body;
  if (
    req.session.user_email == email &&
    req.session.user_id == id &&
    req.session.mailauth == authnumber
  ) {
    bcrypt.hash(pw, 10, (err, pw) => {
      temp.query(
        "insert into members (id,pw,email) values (?,?,?)",
        [id, pw, email],
        (err, result) => {
          if (err) console.log(err);
          else {
            res.send("suc");
          }
        }
      );
    });
  } else {
    res.send("fail");
  }
});

module.exports = router;
