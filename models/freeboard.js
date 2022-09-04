const Sequelize = require("sequelize");
const moment = require("moment");

class Freeboard extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        bno: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(5000),
          allowNull: false,
        },
        replypoint: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          get() {
            return moment(this.getDataValue("createdAt")).format(
              "MM-DD hh:mm:ss"
            );
          },
        },
      },
      {
        sequelize,
        underscored: true, // 대문자를 언더바로 카멜을 스네이크로
        timestamps: true,
        modelName: "Freeboard",
        tableName: "freeboard",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Freeboard.belongsTo(db.User, {
      foreignKey: "nickname",
      targetKey: "nickname",
    });
  }
}

module.exports = Freeboard;
