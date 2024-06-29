'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.belongsToMany(models.Book, {
        through: models.MemberBook,
      });
    }
  }
  Member.init({
    code: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    booksBorrowed: DataTypes.INTEGER,
    isPenalized: DataTypes.BOOLEAN,
    datePenalized: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};