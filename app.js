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

const redis = async (email, data) => {
  const client = createClient({
    url: `redis://${process.env.REDIS_IP}:${process.env.REDIS_PORT}` // for docker
    // url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` //for Zeabur
  })

  client.on('ready', () => {
    console.log('Redis is ready')
  })
  client.on('error', (err) => {
    console.log("Redis' error", err)
  })
  await client.connect()
  const list = {}
  list.email = email
  list.data = data

  await client.lPush('chat:1', JSON.stringify(list))
  const history = await client.lRange('chat:1', 0, -1)
  console.log(history)
  console.log('hi')
  await client.quit()
}

const io = new Server(server, {
  cors: {
    // origin: 'https://internal-toad-properly.ngrok-free.app',
    origin: 'https://tutoring-platform-becky.vercel.app',
    method: ['GET', 'POST'],
    allowedHeaders: ['ngrok-skip-browser-warning']
  }
})

io.on('connection', (socket) => {
  console.log('開啟聊天')

  // 這個joinRoom（名字我自己取的）是當使用者進來頁面就自動觸發（不需靠任何點擊），需要傳入房間名字，
  // 房間名字是 baseurl/class/chat/:roomName，這個我會產生課程link給你，重新feed資料庫
  // 因為如果沒有77-79行，
  // 使用86行會變成 當A發送訊息給Ｂ，但B還沒發送訊息所以沒加入房間，看不到A發的訊息
  socket.on('joinRoom', (roomName, userName) => {
    console.log('join', roomName)
    socket.join(roomName)
    socket.to(roomName).emit('ready', `${userName}準備通話`)
  })

  // 按發送按鈕觸發這裡欸ㄈ
  socket.on('message', (roomName, email, data) => { // 這裡我要接收roomName、email跟data
    console.log('email:', email)
    console.log('data', data)
    redis(email, data)
    socket.to(roomName).emit('message', { email: `${email}`, data: `${data}` })
  })

  socket.on('disconnect', () => {
    console.log('離開聊天')
  })
})

app.use(clientErrorHandler)
server.listen(port, () =>
  console.log(`server listening on http://localhost:${port}`)
)

module.exports = app
