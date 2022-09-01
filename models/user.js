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
        user_email: {
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
        nickname: {
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
  static associate(db) {
    // 1:N 관계 (hasMany, belongsTo)
    // sequelize에서 1:N 관계를 hasMany 함수로 정의한다.
    // hasMany 함수를 이용해서 테이블 관계를 정의해준다.
    // 첫번째 매개변수로 연결할 테이블
    // sourceKey User테이블안에 무슨 키를 foreignKey와 연결할지
    // hasMany()첫번째로 넘겨준 테이블이 foreignKey로 연결되고 foreignKey 이름은 user_id이다.
    // db.User.hasMany(db.Freeboard, {
    //   foreignkey: "nickname",
    //   sourceKey: "nickname",
    // });
    // db.User.hasMany(db.Reply, {
    //   foreignkey: "nickname",
    //   sourceKey: "nickname",
    // });
    // db.User.hasMany(db.Notice, {
    //   foreignkey: "nickname",
    //   sourceKey: "nickname",
    // });
    // db.User.hasMany(db.Reply_Reply, {
    //   foreignkey: "nickname",
    //   sourceKey: "nickname",
    // });
  }
}

module.exports = User;
