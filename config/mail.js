const dotenv = require("dotenv").config();
const mail = {
  user: "rudghks09@naver.com",
  password: process.env.MAIL_PASSWORD,
};

module.exports = mail;
