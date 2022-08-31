const Sequelize = require("sequelize");

class Reply_Reply extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        rereply: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
        },
        rno: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        // nickname: {
        //   type: Sequelize.STRING(1000),
        //   allowNull: false,
        // },
      },
      {
        sequelize,
        underscored: true, // 대문자를 언더바로 카멜을 스네이크로
        timestamps: true,
        modelName: "Reply_Reply",
        tableName: "reply_reply",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Reply_Reply.belongsTo(db.User, {
      foreignKey: "nickname",
      targetKey: "nickname",
    });
  }
}

module.exports = Reply_Reply;
