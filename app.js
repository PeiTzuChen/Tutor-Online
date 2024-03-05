if ((process.env.NODE_ENV === 'development')) require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 3000
const route = require('./routes')
const passport = require('./config/passport')
const server = http.Server(app)
const { Server } = require('socket.io')

const { createClient } = require('redis')

// cross-origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.103:3000')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Accept, Accept-Encoding'
  )
  next()
})

const { engine } = require('express-handlebars')
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

const redis = async (id, data) => {
  const client = createClient({ url: 'redis://127.0.0.1:6379' })
  client.on('ready', () => {
    console.log('Redis is ready')
  })
  client.on('error', (err) => {
    console.log("Redis' error", err)
  })
  await client.connect()
  const list = {}
  list[id] = data

  await client.lPush('dialog', JSON.stringify(list))

  await client.quit()
}

const io = new Server(server)
const list = {}
io.on('connection', (socket) => {
  const userId = socket.id
  list[userId] = 'test' // F_PV4fqZgWv03jUgAAAC: 'test'  eachId has own avatar
  socket.on('message', (id, data) => {
    redis(id, data)
    socket.broadcast.emit('message', list[id], data)
  })
})

app.use(express.json())
app.use(passport.initialize())
app.use(route)

server.listen(port, () =>
  console.log(`server listening on http://localhost:${port}`)
)
