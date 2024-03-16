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
const path = require('path')
const { clientErrorHandler } = require('./middlewares/errorHandler')
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

const { engine } = require('express-handlebars')

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.json())
app.use(passport.initialize())
app.use(route)

const redis = async (id, data) => {
  const client = createClient({
    url: `redis://${process.env.REDIS_IP}:${process.env.REDIS_PORT}`
  })

  client.on('ready', () => {
    console.log('Redis is ready')
  })
  client.on('error', (err) => {
    console.log("Redis' error", err)
  })
  await client.connect()
  const list = {}
  list[id] = data

  await client.lPush('chat:1', JSON.stringify(list))

  await client.quit()
}

const io = new Server(server, {
  // cors: {
  //   origin: "https://internal-toad-properly.ngrok-free.app",
  //   method: ["GET", "POST"],
  //   allowedHeaders:{}
  // },
});
app.use('/test', (req, res) => {
  console.log('連到本地')
  res.send('hi')
})

io.on('connection', (socket) => {
  console.log('開啟聊天')
  // const userId = socket.id
  socket.on('message', (id, data) => {
    console.log(data)
    // redis(id, data)
    socket.broadcast.emit('message', id, data)
  })

  socket.on('disconnect', () => {
    console.log('離開聊天')
  })
})

app.use(clientErrorHandler)
server.listen(port, () =>
  console.log(`server listening on http://localhost:${port}`)
)
