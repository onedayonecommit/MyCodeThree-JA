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
const Session = require("./config/session");
const temp = mysql.createConnection({
  user: "root",
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: "test99",
});
app.use(session(Session));
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
        text: `${email} 님 반갑습니다. 이메일 인증번호는 <h1>${authnumber}</h1> 입니다. 인증번호 칸에 입력 후 인증 확인 부탁드립니다.
          <h1>지니 바보</h1>`,
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
const email = "rudgks09@naver.com";
const authnumber = "1234234";
app.get("/test", (req, res) => {
  res.send(
    email +
      `님 반갑습니다 이메일 인증 번호는<h1>` +
      authnumber +
      `</h1>
    입니다. 해당 6자리의 숫자를 인증번호 칸에 입력 후 인증 확인 부탁드립니다.`
  );
});
