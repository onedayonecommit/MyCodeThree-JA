"use strict";

const Sequelize = require("sequelize");
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let Mysql = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.Sequelize = Sequelize;

module.exports = db;
