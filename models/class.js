'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Class.init(
    {
      isBooked: DataTypes.BOOLEAN,
      isCompleted: DataTypes.BOOLEAN,
      length: DataTypes.INTEGER,
      date: DataTypes.DATE,
      link: DataTypes.STRING,
      studentId: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Class',
      underscored: true,
      tableName: 'Classes'
    }
  )
  return Class
}
