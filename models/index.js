const Sequelize = require("sequelize");
const config = require("../config/config");
const db = {};

let sequelize = new Sequelize(
  config.dev.database,
  config.dev.username,
  config.dev.password,
  config.dev
);

db.sequelize = sequelize;

module.exports = db;
