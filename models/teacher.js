'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Teacher.belongsToMany(models.Category, {
        through: models.CategoryTeacher,
        foreignKey: 'teacherId',
        as: 'categoriesInTeacher'
      })
      Teacher.hasOne(models.User, { foreignKey: 'teacherId' })
    }
  }
  Teacher.init(
    {
      name: DataTypes.STRING,
      country: DataTypes.STRING,
      introduction: DataTypes.STRING(1234),
      style: DataTypes.STRING(1234),
      avatar: DataTypes.STRING,
      link: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Teacher',
      underscored: true,
      tableName: 'Teachers'
    }
  )
  return Teacher
}
