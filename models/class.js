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
      Class.belongsTo(models.Student, { foreignKey: 'studentId' })
      Class.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
    }
  }
  Class.init(
    {
      isBooked: DataTypes.BOOLEAN,
      isCompleted: DataTypes.BOOLEAN,
      isCommented: DataTypes.BOOLEAN,
      length: DataTypes.INTEGER,
      dateTimeRange: DataTypes.STRING,
      name: DataTypes.STRING,
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
