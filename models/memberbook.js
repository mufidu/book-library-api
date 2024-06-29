'use strict';
/**
 * @swagger
 * components:
 *   schemas:
 *     MemberBook:
 *       type: object
 *       required:
 *         - BookId
 *         - MemberId
 *         - dateBorrowed
 *       properties:
 *         BookId:
 *           type: string
 *           description: Book's ID
 *         MemberId:
 *           type: string
 *           description: Member's ID
 *         dateBorrowed:
 *           type: string
 *           format: date-time
 *           description: Date when the book was borrowed
 */
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