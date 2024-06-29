'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MemberBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MemberBook.belongsTo(models.Member);
      MemberBook.belongsTo(models.Book);
    }
  }
  MemberBook.init({
    BookId: DataTypes.STRING,
    MemberId: DataTypes.STRING,
    dateBorrowed: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MemberBook',
  });
  return MemberBook;
};