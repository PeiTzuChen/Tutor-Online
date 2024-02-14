module.exports = (error, req, res, next) => {
  if (error instanceof Error) {
    switch (error.name) {
      case 'SequelizeDatabaseError':
        res.status(500).json({
          status: 'Sequelize error',
          message: `${error.message}`
        })
        break
      default:
        res.status(error.status || 500).json({
          status: 'error',
          message: `${error.name}: ${error.message}`
        })
    }
  } else {
    res.status(500).json({
      status: 'Server error',
      message: `${error}`
    })
  }
  next(error)
}
