const multer = require('multer')
const Sequelize = require('sequelize')
const routeErrorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'error',
      message: `Multer error: ${error.message}`
    })
  } else if (error instanceof SyntaxError) {
    return res.status(500).json({
      status: 'error',
      message: `Syntax error: ${error.message}`
    })
  } else if (error instanceof Sequelize.Error) {
    return res.status(500).json({
      status: 'error',
      message: `Sequelize error: ${error.message}`
    })
  } else if (error instanceof Error) {
    res.status(error.status || 500).json({
      status: 'error',
      message: `${error.name}: ${error.message}`
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: `${error.name}: ${error.message}`
    })
  }
  next(error)
}

module.exports = routeErrorHandler
