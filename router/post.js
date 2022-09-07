const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Session = require("../config/session");
const router = express.Router();
const mailer = require("./mailer");
const randomauth = require("./randomauth");
const jwt = require("jsonwebtoken");
const jwtsign = require("./jwt");
const { user } = require("../config/mail");
const { User, Freeboard } = require("../models");
const middleware = require("./tokenmiddleware");
router.use(session(Session));

/**  로그인 요청 처리하는 곳 */
router.post("/login", (req, res) => {
  const { id, pw } = req.body;
  User.findOne({ where: { user_id: id } })
    .then((e) => {
      // 이메일로 받은 값이 가입된 회원일 경우 암호화된 비밀번호 비교
      if (e) {
        bcrypt.compare(pw, e.user_password, (err, same) => {
          // 암호화된 비밀번호가 같을경우 토큰 발급
          if (same) {
            const accessToken = jwt.sign(
              {
                email: id,
                name: e.name,
              },
              process.env.ACCESS_TOKEN,
              {
                expiresIn: "5m",
                issuer: "ksh",
              }
            );

            const refreshToken = jwt.sign(
              {
                email: id,
              },
              process.env.REFRESH_TOKEN,
              {
                expiresIn: "1h",
                issuer: "ksh",
              }
            );

            // ref_tok를 확인해서 acc_tok 재발급하기 위해 db에 추가
            User.update({ refresh: refreshToken }, { where: { user_id: id } });

            // session에 발급된 토큰 저장
            req.session.access_token = accessToken;
            req.session.refresh_token = refreshToken;

            res.send("login true");
          } else {
            // 비밀번호가 다를경우
            res.send("fail");
          }
        });
        // 회원이 아닐경우
      } else {
        res.send("fail");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

/** 이메일 인증 하는 곳 */
router.post("/email", (req, res) => {
  const { email } = req.body;
  const authnumber = randomauth.randomfunc();
  // req.session.authnumber = bcrypt.hashSync(authnumber, 10);
  User.findOne({ where: { user_email: email } }).then((e) => {
    if (e == null && email != "") {
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
        subject: `안녕하세요 내 코 석 이메일 인증번호 입니다.`,
        text: `${email} 님 반갑습니다. 이메일 인증번호는 <h1>${authnumber}</h1> 입니다. 인증번호 칸에 입력 후 인증 확인 부탁드립니다.`,
      };
      mailer.sendmail(sendmail);
      req.session.user_auth_number = authnumber;
      res.send("usable");
    } else if (e != null) {
      res.send("disusable");
    } else if (email == "") {
      res.send("failed");
    }
  });
});

/** 이메일 인증번호 확인 하는 곳 */
router.post("/authcheck", (req, res) => {
  let authnumber = req.body.authnumber;
  if (authnumber != "") {
    jwt.verify(
      req.session.emailtoken,
      process.env.ACCESSTOKEN_SECRET,
      (err, decoded) => {
        if (err) res.send("timeover");
        else if (req.session.user_auth_number == authnumber) res.send("suc");
        else res.send("fail");
      }
    );
  } else res.send("null");
});

/** 아이디 중복 확인 하는 곳 */
router.post("/userIdCheck", (req, res) => {
  User.findOne({ where: { user_id: req.body.id } }).then((e) => {
    if (e == null) {
      req.session.user_id = req.body.id;
      console.log(req.session);
      res.send("usable");
    } else {
      res.send("disuable");
    }
  });
});

/** 닉네임 중복 확인 하는 곳 */
router.post("/nickCheck", (req, res) => {
  User.findOne({ where: { nickname: req.body.user_nickname } }).then((e) => {
    if (e == null && req.body.user_nickname != "") {
      req.session.user_nickname = req.body.user_nickname;
      res.send("usable");
    } else if (e != null) res.send("disusable");
    else if (req.body.user_nickname != "") res.send("null");
  });
});

/** 회원가입 요청 처리하는 곳*/
router.post("/signup", (req, res) => {
  let { id, email, authnumber, nickname, name, password, password_a, phone } =
    req.body;
  if (
    id != "" &&
    email != "" &&
    authnumber != "" &&
    nickname != "" &&
    name != "" &&
    password != "" &&
    phone != ""
  ) {
    if (
      req.session.user_email == email &&
      req.session.user_id == id &&
      req.session.user_auth_number == authnumber &&
      req.session.user_nickname == nickname &&
      password == password_a
    ) {
      bcrypt.hash(password, 10, (err, pw) => {
        User.create({
          user_id: id,
          user_email: email,
          nickname: nickname,
          user_phone: phone,
          user_name: name,
          user_password: pw,
        });
        res.send("success");
      });
    } else {
      res.send("fail");
    }
  } else {
    res.send("notnull");
  }
});

/** 아이디 찾을 때 이메일 인증받기 */
router.post("/findemail", (req, res) => {
  const email = req.body.email;
  User.findOne({ where: { user_email: req.body.email } }).then((e) => {
    if (e == null) res.send("notemail");
    else if (email != "") {
      req.session.user_email = req.body.email;
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
      const authnumber = randomauth.randomfunc();
      let sendmail = {
        toEmail: email,
        subject: `안녕하세요 내 코 석 이메일 인증번호 입니다.`,
        text: `${email} 님 반갑습니다. 이메일 인증번호는 <h1>${authnumber}</h1> 입니다. 인증번호 칸에 입력 후 인증 확인 부탁드립니다.`,
      };
      console.log(authnumber);
      mailer.sendmail(sendmail);
      req.session.user_auth_number = authnumber;
      res.send("success");
    }
  });
});

/** 패스워드 변경 */
router.post("/findpw", (req, res) => {
  const { id, email, authnumber, name, phone } = req.body;
  if (
    id != "" &&
    email != "" &&
    authnumber != "" &&
    name != "" &&
    phone != ""
  ) {
    User.findOne({
      where: {
        user_id: id,
        user_email: email,
        user_name: name,
        user_phone: phone,
      },
    }).then((e) => {
      if (e == null) res.send("notfound");
      else {
        if (
          req.session.user_auth_number == authnumber &&
          req.session.user_email == email
        ) {
          req.session.findpwtoken = jwt.sign(
            {
              user_email: email,
              name: name,
            },
            process.env.FINDPWTOKEN,
            {
              expiresIn: "5m",
              issuer: "gh",
            }
          );
          res.send("success");
        } else {
          res.send("fail");
        }
      }
    });
  } else {
    res.send("notnull");
  }
});

router.post("/finalchangepw", (req, res) => {
  const { user_pw, user_pw_a } = req.body;
  if (user_pw != user_pw_a) res.send("failpw");
  else if (user_pw == user_pw_a && user_pw != "") {
    jwt.verify(
      req.session.findpwtoken,
      process.env.FINDPWTOKEN,
      (err, decoded) => {
        if (err) res.send("timeover");
        else if (decoded) {
          bcrypt.hash(user_pw, 10, (err, result) => {
            User.update(
              { user_password: result },
              { where: { user_email: decoded.user_email } }
            );
          });
          req.session.destroy(() => {
            req.session;
          });
          res.send("success");
        }
      }
    );
  }
});

router.post("/changepw", (req, res) => {
  const { nowpw, user_password, user_password_a } = req.body;
  const user_id = jwt.verify(
    req.session.access_token,
    process.env.ACCESS_TOKEN,
    (err, decoded) => {
      return decoded.email;
    }
  );
  User.findOne({ where: { user_id: user_id } }).then((e) => {
    bcrypt.compare(nowpw, e.user_password, (err, decoded) => {
      if (!decoded) res.send("nowpwfailed");
      else if (user_password != "" && user_password == user_password_a) {
        bcrypt.hash(user_password, 10, (err, encoded) => {
          User.update(
            { user_password: encoded },
            { where: { user_id: user_id } }
          );
          req.session.destroy(() => {
            req.session;
          });
          res.send("success");
        });
      } else {
        res.send("updatepwfailed");
      }
    });
  });
});

router.post("/findid", (req, res) => {
  const { email, authnumber, name, phoneNum } = req.body;
  if (email != "" && authnumber != "" && name != "" && phoneNum != "") {
    if (
      req.session.user_auth_number == authnumber &&
      req.session.user_email == email
    ) {
      User.findOne({
        where: { user_email: email, user_name: name, user_phone: phoneNum },
      }).then((e) => {
        if (e == null) res.send("notfound");
        else {
          req.session.findid = jwt.sign(
            { email: email },
            process.env.FINDIDTOKEN,
            {
              expiresIn: "5m",
            }
          );
          res.send("success");
        }
      });
    } else res.send("failed");
  } else res.send("notnull");
});

router.post("/contentregist", (req, res) => {
  console.log("포스트 접속 완료");
  const { title, content } = req.body;
  if (title != "" && content != "") {
    try {
      const user_id = jwt.verify(
        req.session.access_token,
        process.env.ACCESS_TOKEN
      ).email;
      User.findOne({ where: { user_id: user_id } }).then((e) => {
        Freeboard.create({
          title: title,
          content: content,
          nickname: e.nickname,
        });
      });
      res.send("success");
    } catch (error) {
      res.send("notlogin");
    }
  } else res.send("fail");
});

/** 이메일 인증 후 패스워드 변경 할 페이지 */
// router.post("/changepwhurryup", (req, res) => {
//   jwt.verify(
//     req.session.findpwtoken,
//     process.env.FINDPWTOKEN,
//     (err, decoded) => {
//       if (err) res.send("timeover");
//       else res.render("pwchange");
//     }
//   );
// });

module.exports = router;
