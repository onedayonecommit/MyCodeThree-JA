const dotenv = require("dotenv").config();

const config = {
  dev: {
    username: "root",
    password: process.env.PASSWORD,
    host: "127.0.0.1",
    database: "test99",
    dialect: "mysql",
  },
};

module.exports = config;
