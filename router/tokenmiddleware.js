const express = require("express");
const session = require("express-session");
const Session = require("../config/session");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const router = express.Router();
router.use(session(Session));

let temp = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test99",
  password: process.env.DB_PASSWORD,
});

// const middleware = (req, res, next) => {
//   const { accesstoken, refreshtoken } = req.session;
//   try {
//     jwt.verify(accesstoken, process.env.ACCESSTOKEN_SECRET); // 어세스 토큰의 유효 여부
//     next();
//   } catch (error) {
//     // 어세스토큰이 없거나 유효기간이 지난 경우
//     try {
//       jwt.verify(refreshtoken, process.env.REFRESHTOKEN_SECRET);
//       temp.query(
//         "select refresh from members where id = ? ",
//         req.session.user_id,
//         (err, result) => {
//           const id = jwt.verify(
//             result[0].refresh,
//             process.env.REFRESHTOKEN_SECRET
//           ).user_id;
//           if (refreshtoken != result[0].refresh) res.redirect("/login");
//           else {
//             req.session.accesstoken = jwt.sign(
//               {
//                 user_id: id,
//               },
//               process.env.ACCESSTOKEN_SECRET,
//               {
//                 expiresIn: "15m",
//                 issuer: "gyeonghwan",
//               }
//             );
//             next();
//           }
//         }
//       );
//     } catch (error) {
//       res.redirect("/login");
//     }
//   }
// };

/**토큰 유효성 검사 미들웨어 */
// const middleware = (req, res, next) => {
//   const { accesstoken, refreshtoken } = req.session;
//   jwt.verify(accesstoken, process.env.ACCESSTOKEN_SECRET, (err, decoded) => {
//     if (err) res.send("tokenfail");
//     else {
//       temp.query(
//         "select refresh from members where id = ?",
//         req.session.user_id,
//         (err, result) => {
//           if (result[0] == undefined) {
//             res.send("nottoken");
//           } else if (result[0] != undefined) {
//             jwt.verify(
//               result[0].refresh,
//               process.env.REFRESHTOKEN_SECRET,
//               (err, decoded) => {
//                 if (err) res.send("nottoken");
//                 else next();
//               }
//             );
//           }
//         }
//       );
//     }
//   });
// };

const middleware = (req, res, next) => {
  // session에서 로그인시 발급된 토큰 가져오기
  const { access_token, refresh_token } = req.session;

  // acc_tok 검증
  jwt.verify(access_token, process.env.ACCESS_TOKEN, (err, acc_decoded) => {
    if (err) {
      // acc_tok 유효기간 지났을 경우 ref_tok 검증
      jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN,
        (err, ref_decoded) => {
          // ref_tok 만료된 경우
          if (err) {
            res.redirect("/");
          } else {
            // ref_tok 존재하여 해당 email 찾아 acc_tok 재발급
            User.findOne({ where: { email: ref_decoded.email } })
              .then((e) => {
                if (e?.refresh == refresh_token) {
                  const accessToken = jwt.sign(
                    {
                      email: ref_decoded.email,
                      name: ref_decoded.name,
                    },
                    process.env.ACCESS_TOKEN,
                    {
                      expiresIn: "5m",
                      issuer: "ksh",
                    }
                  );

                  req.session.access_token = accessToken;
                  // acc_tok 재발급하여 로그인 유지
                  next();
                } else {
                  // tok 전부 만료되어 다시 로그인
                  res.redirect("/log");
                }
              })
              .catch((err) => {
                res.send(err);
              });
          }
        }
      );
    } else {
      // acc_tok 유효하여 로그인 유지
      next();
    }
  });
};

module.exports = middleware;
