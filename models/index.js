const Sequelize = require("sequelize");
const config = require("../config/config");
const User = require("./user");
const Reply = require("./reply");
const Reply_Reply = require("./reply-reply");
const Freeboard = require("./freeboard");
const Notice = require("./notice");
const User_inventory = require("./user_inventory");
let sequelize = new Sequelize(
  config.dev.database,
  config.dev.username,
  config.dev.password,
  config.dev
);

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Reply = Reply;
db.Reply_Reply = Reply_Reply;
db.Freeboard = Freeboard;
db.Notice = Notice;
db.User_inventory = User_inventory;

User.init(sequelize);
Reply.init(sequelize);
Reply_Reply.init(sequelize);
Freeboard.init(sequelize);
Notice.init(sequelize);
User_inventory.init(sequelize);

console.log(db);
module.exports = db;
