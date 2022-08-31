const Sequelize = require("sequelize");

class User_inventory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        item1: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 0,
        },
        item2: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 0,
        },
        item3: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 0,
        },
        item4: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 0,
        },
        item5: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        underscored: true, // 대문자를 언더바로 카멜을 스네이크로
        timestamps: true,
        modelName: "User_inventory",
        tableName: "user_inventory",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
}

module.exports = User_inventory;
