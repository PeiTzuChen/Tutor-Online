'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CategoryTeacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  CategoryTeacher.init(
    {
      teacherId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'CategoryTeacher',
      underscored: true,
      tableName: 'CategoryTeachers'
    }
  )
  return CategoryTeacher
}
