const multer = require('multer')

const routeErrorHandler = (error, req, res, next) => {
  if (error instanceof Error) {
    res.status(error.status || 500).json({
      status: 'error',
      message: `${error.name}: ${error.message}`
    })
  } else if (error instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'error',
      message: `Multer error: ${error.message}`
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
