const Sequelize = require("sequelize");

class Skin extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        sno: {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        skin_name: {
          type: Sequelize.STRING(1000),
          allowNull: false,
          unique: true,
        },
        skin_image: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        underscored: true, // 대문자를 언더바로 카멜을 스네이크로
        timestamps: true,
        modelName: "Skin",
        tableName: "skin",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
}

module.exports = Skin;
