const Sequelize = require("sequelize");

class Notice extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        nno: {
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
        // nickname: {
        //   type: Sequelize.STRING(1000),
        //   unique: true,
        //   allowNull: false,
        // },
      },
      {
        sequelize,
        underscored: true, // 대문자를 언더바로 카멜을 스네이크로
        timestamps: true,
        modelName: "Notice",
        tableName: "notice",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Notice.belongsTo(db.User, {
      foreignKey: "nickname",
      targetKey: "nickname",
    });
  }
}

module.exports = Notice;
