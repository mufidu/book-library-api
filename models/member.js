'use strict';
/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - password
 *       properties:
 *         code:
 *           type: string
 *           description: Unique code for the member.
 *         name:
 *           type: string
 *           description: Name of the member.
 *         password:
 *           type: string
 *           format: password
 *           description: Password for the member account.
 *         booksBorrowed:
 *           type: integer
 *           description: Number of books borrowed by the member.
 *         isPenalized:
 *           type: boolean
 *           description: Whether the member is penalized.
 *         datePenalized:
 *           type: string
 *           format: date-time
 *           description: The date when the member was penalized.
 */
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
    name: DataTypes.STRING,
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