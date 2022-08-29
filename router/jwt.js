const jwt = require("jsonwebtoken");

module.exports.atloginsign = (id) => {
  jwt.sign(
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
  jwt.sign(
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
