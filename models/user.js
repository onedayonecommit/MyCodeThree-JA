const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        eamil: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
      },
      {}
    );
  }
}
