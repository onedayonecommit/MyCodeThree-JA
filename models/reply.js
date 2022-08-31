const Sequelize = require("sequelize");

class Reply extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        rno: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        content: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        nickname: {
          type: Sequelize.STRING(1000),
          allowNull: false,
          unique: true,
        },
        boardnum: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        underscored: true, // 대문자를 언더바로 카멜을 스네이크로
        timestamps: true,
        modelName: "Reply",
        tableName: "reply",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
}

module.exports = Reply;
