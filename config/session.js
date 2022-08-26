const dot = require("dotenv").config();
/**세션 정보 */
const session = {
  key: "rudghks09",
  // 세션을 발급할 때 사용되는 키 소스코드 노출 안되게 env에 담아서 사용
  secret: process.env.SESSION_SECRET,
  // 세션을 저장하고 불러올 때 다시 저장할지 여부
  resave: false,
  // 세션에 저장할 때 초기화 여부
  saveUninitialized: true,
  // 저장소를 만들지 여부
  // store: new filestore(),
};

module.exports = session;
