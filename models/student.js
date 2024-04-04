'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Student.hasOne(models.User, { foreignKey: 'studentId' })
      Student.hasMany(models.Class, { foreignKey: 'studentId' })
      Student.hasMany(models.Comment, { foreignKey: 'studentId' })
    }
  }
  Student.init({
    name: DataTypes.STRING,
    introduction: DataTypes.STRING(1234),
    avatar: DataTypes.STRING,
    totalLearningTime: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Student',
    underscored: true,
    tableName: 'Students'
  })
  return Student
}
