const dotenv = require("dotenv").config();
const mail = {
  user: process.env.MAIL,
  password: process.env.MAIL_PASSWORD,
};

module.exports = mail;
