'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Comment.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
    }
  }
  Comment.init({
    score: DataTypes.FLOAT,
    text: DataTypes.STRING,
    studentId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
    underscored: true,
    tableName: 'Comments'
  })
  return Comment
}
