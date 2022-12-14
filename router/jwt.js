const jwt = require("jsonwebtoken");

module.exports.atloginsign = (id) => {
  return jwt.sign(
    {
      user_id: id,
    },
    process.env.ACCESSTOKEN_SECRET,
    {
      expiresIn: "15m",
      issuer: "gyeonghwan",
    }
  );
};
module.exports.rtloginsign = (id) => {
  return jwt.sign(
    {
      user_id: id,
    },
    process.env.REFRESHTOKEN_SECRET,
    {
      expiresIn: "1h",
      issuer: "gyeonghwan",
    }
  );
};

module.exports.atverify = (token) => {
  return jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
};
