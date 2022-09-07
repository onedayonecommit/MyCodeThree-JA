const dotenv = require("dotenv").config();

const config = {
  dev: {
    username: "root",
    password: process.env.DB_PASSWORD,
    host: "localhost",
    database: "test99",
    dialect: "mysql",
  },
};

module.exports = config;
