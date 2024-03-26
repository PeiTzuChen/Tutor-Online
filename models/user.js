'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
      User.belongsTo(models.Student, { foreignKey: 'studentId' })
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      subMail: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      studentId: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'User',
      underscored: true,
      tableName: 'Users'
    }
  )
  return User
}
