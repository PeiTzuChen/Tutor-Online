'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isTeacher: DataTypes.BOOLEAN,
    studentId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    tableName: 'Users'
  })
  return User
}
