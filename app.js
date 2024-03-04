if ((process.env.NODE_ENV === 'development')) require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 3000
const route = require('./routes')
const passport = require('./config/passport')
const server = http.Server(app)
const { Server } = require('socket.io')

// cross-origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.103:3000')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, authorization, accept, accept-encoding'
  )
  next()
})

const { engine } = require('express-handlebars')
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

const io = new Server(server)
io.on('connection', (socket) => {
  console.log('userID: ', socket.id)
})

app.use(express.json())
app.use(passport.initialize())
app.use(route)

server.listen(port, () =>
  console.log(`server listening on http://localhost:${port}`)
)
