const express = require("express");
const router = express.Router();
const session = require("express-session");
const Session = require("../config/session");
const jwt = require("jsonwebtoken");
const middleware = require("./tokenmiddleware");
const { application } = require("express");
router.use(session(Session));
const { User, Freeboard, Skin } = require("../models");
/** 메인페이지 */

router.get("/", (req, res) => {
  res.render("start");
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
router.get("/changepw", (req, res) => {
  jwt.verify(
    req.session.findpwtoken,
    process.env.FINDPWTOKEN,
    (err, decoded) => {
      if (err) res.redirect("/find");
      else if (decoded) {
        res.render("pwchange", { name: decoded.name });
      }
    }
  );
});

/** 이메일 찾기 페이지 = (3-1) */
router.get("/findEmail", (req, res) => {
  res.render("findEmail");
});

/** 회원가입 당시 저장한 세션 초기화 */
router.get("/deletesession", (req, res) => {
  console.log(req.session);
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
  try {
    jwt.verify(req.session.access_token, process.env.ACCESS_TOKEN);
    res.redirect("/keep");
  } catch (error) {
    Freeboard.findAll({
      order: [["createdAt", "DESC"]],
    }).then((e) => {
      res.render("login", {
        data: e,
      });
    });
  }
});

/** (1), acc_tok 확인하여 로그인 유지 (middleware 수행) */
router.get("/keep", middleware, (req, res) => {
  console.log(req.session);
  // acc_tok 검증하여 해당 email 변수 담기
  let email = jwt.verify(
    req.session.access_token,
    process.env.ACCESS_TOKEN,
    (err, result) => {
      return result.email;
    }
  );
  console.log(email);
  // 담은 변수를 render page에 정보 보내기
  User.findOne({ where: { user_id: email } }).then((ee) => {
    Freeboard.findAll({
      order: [["createdAt", "DESC"]],
    }).then((e) => {
      res.render("login(keep)", {
        id: ee.user_name,
        data: e,
      });
    });
  });
});

// 로그인 전 store 페이지
router.get("/store", (req, res) => {
  try {
    jwt.verify(req.session.access_token, process.env.ACCESS_TOKEN);
    res.redirect("/storeKeep");
  } catch (error) {
    res.render("store");
  }
});

// 로그인 후 유저 store keeping page
router.get("/storeKeep", middleware, (req, res) => {
  const user_email = jwt.verify(
    req.session.access_token,
    process.env.ACCESS_TOKEN,
    (err, decoded) => {
      return decoded.email;
    }
  );
  try {
    User.findOne({ where: { user_id: user_email } }).then((ee) => {
      Skin.findAll({}).then((e) => {
        console.log(e[0]);
        res.render("store(keep)", { data: ee, skin: e });
      });
    });
  } catch (error) {
    res.redirect("/deletesession");
  }
});

// 로그인 후 관리자 store page
router.get("/storeManager", (req, res) => {
  res.render("store(manager)");
});

// 마이페이지
router.get("/mypage", middleware, (req, res) => {
  const user_email = jwt.verify(
    req.session.access_token,
    process.env.ACCESS_TOKEN,
    (err, decoded) => {
      return decoded.email;
    }
  );
  User.findOne({ where: { user_id: user_email } }).then((e) => {
    res.render("mypage_edit(gh)", { data: e });
  });
});

// 글쓰기 버튼 클릭했을 때
router.get("/writing", (req, res) => {
  console.log(req.session);
  res.render("writing");
});

router.get("/myid", (req, res) => {
  jwt.verify(req.session.findid, process.env.FINDIDTOKEN, (err, decoded) => {
    if (err) res.redirect("/findEmail");
    else {
      User.findOne({ where: { user_email: decoded.email } }).then((e) => {
        if (e == null) res.redirect("/findEmail");
        else res.render("myEmail", { data: e });
      });
    }
  });
});
router.get("/board/:id", (req, res) => {
  Freeboard.findOne({ where: { bno: req.params.id } }).then((e) => {
    if (e == null) {
      res.status(404).render("404");
    } else {
      let content = `<!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      </head>
      <body>
      <h1>제목 : ${e.title}</h1></br>
      <h3>내용 : ${e.content}</h3>
      </body>
      </html>`;
      res.send(content);
    }
  });
});

// router.get("/board/" + "?id" , (req, res) => {
//   Freeboard.findOne
// });
module.exports = router;
