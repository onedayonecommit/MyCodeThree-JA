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

const middleware = (req, res, next) => {
  const { accesstoken, refreshtoken } = req.session;
  try {
    jwt.verify(accesstoken, process.env.ACCESSTOKEN_SECRET);
    next();
  } catch (error) {
    try {
      jwt.verify(refreshtoken, process.env.REFRESHTOKEN_SECRET);
      temp.query(
        "select refresh from members where id = ? ",
        req.session.user_id,
        (err, result) => {
          if (refreshtoken != result[0].refresh) res.send("tokenfail");
          else {
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
            next();
          }
        }
      );
    } catch (error) {
      res.send("tokenfail");
    }
  }
};

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

module.exports = middleware;
