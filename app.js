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
const mailer = require("./router/mailer");
const randomauth = require("./router/randomauth");
const temp = mysql.createConnection({
  user: "root",
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: "test99",
});
app.use(
  session({
    key: "rudghks09",
    // 세션을 발급할 때 사용되는 키 소스코드 노출 안되게 env에 담아서 사용
    secret: process.env.SESSION_SECRET,
    // 세션을 저장하고 불러올 때 다시 저장할지 여부
    resave: false,
    // 세션에 저장할 때 초기화 여부
    saveUninitialized: true,
    // 저장소를 만들지 여부
    // store: new filestore(),
  })
);
app.use(express.static("cssandjs"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("signup");
});

app.post("/email", (req, res) => {
  const { email } = req.body;
  const authnumber = randomauth.randomfunc();
  // req.session.authnumber = bcrypt.hashSync(authnumber, 10);

  temp.query("select * from members where email = ?", email, (err, result) => {
    console.log(result);
    if (err) {
      console.log("qserr", err);
    } else if (result[0] == undefined) {
      let sendmail = {
        toEmail: email,
        subject: `안녕하세요 내코석 이메일 인증번호 입니다.`,
        text: `${email}님 반갑습니다 이메일 인증 번호는 ${authnumber} 입니다. 해당 6자리의 숫자를 인증번호 칸에 입력 후 인증 확인 부탁드립니다.`,
      };

      mailer.sendmail(sendmail);
      res.send("suc");
    } else if (result[0] != undefined) {
      res.send("fail");
    } else {
      res.send("failed");
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log("server on");
});
