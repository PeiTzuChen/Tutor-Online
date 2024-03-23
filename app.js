if ((process.env.NODE_ENV === 'development')) require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 3000
const route = require('./routes')
const passport = require('./config/passport')
const server = http.Server(app)
const { Server } = require('socket.io')
const path = require('path')
const { clientErrorHandler } = require('./middlewares/errorHandler')
const socketHelper = require('./helpers/socket.helper')

const testPath = require('./upload/testpath')
// cross-origin
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Accept, Accept-Encoding,ngrok-skip-browser-warning'
  )
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  } // 需寫在res.setHeader底部，第一次options request也會讀setHeader值
  next()
})

app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(express.json())
app.use(passport.initialize())
app.use(route)

const io = new Server(server, {
  cors: {
    origin: 'https://kingfish-generous-sharply.ngrok-free.app',
    // origin: 'https://tutoring-platform-becky.vercel.app',
    method: ['GET', 'POST'],
    allowedHeaders: ['ngrok-skip-browser-warning']
  }
})
socketHelper(io)

app.use(clientErrorHandler)
server.listen(port, () =>
  console.log(`server listening on http://localhost:${port}`)
)

module.exports = app
