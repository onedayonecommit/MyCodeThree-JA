const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.STRING(1000),
          allowNull: false,
          unique: true,
        },
        user_eamil: {
          type: Sequelize.STRING(1000),
          allowNull: false,
          unique: true,
        },
        user_phone: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        user_name: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        user_nickname: {
          type: Sequelize.STRING(1000),
          allowNull: false,
          unique: true,
        },
        admin: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 0,
        },
        refresh: {
          type: Sequelize.STRING(1000),
          allowNull: true,
        },
        user_password: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        user_socket_id: {
          type: Sequelize.STRING(1000),
          allowNull: true,
        },
        cash_point: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        sequelize,
        underscored: true, // 대문자를 언더바로 카멜을 스네이크로
        timestamps: true,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
}

module.exports = User;
