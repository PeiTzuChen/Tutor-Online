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
      // define association here
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
