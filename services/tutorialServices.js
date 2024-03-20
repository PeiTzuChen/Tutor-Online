const { Student } = require('../models')

module.exports = function setupNewUser (info, callback) {
  const user = {
    name: info.name,
    nameLowercase: info.name.toLowerCase()
  }

  try {
    Student.findOne(user, callback)
  } catch (err) {
    callback(err)
  }
}
