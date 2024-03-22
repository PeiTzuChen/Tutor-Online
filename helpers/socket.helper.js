const { createClient } = require('redis')

module.exports = function (io) {
  io.on('connection', (socket) => {
    let person = ''
    socket.on('joinRoom', (room, userName) => {
      person = userName
      console.log(`${person}join`, room)
      socket.join(room)
      socket.to(room).emit('ready', `${userName}準備通話`)
    })

    socket.on('message', (room, email, data) => {
      // redis(room, email, data)
      console.log('寫入訊息', data)
      socket.to(room).emit('message', { email: `${email}`, data: `${data}` })
    })
    socket.on('disconnect', () => {
      console.log(`${person}離開聊天`)
    })
  })

  const redis = async (room, email, data) => {
    const client = createClient({
      // url: `redis://${process.env.REDIS_IP}:${process.env.REDIS_PORT}` // for docker
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` // for Zeabur
    })

    client.on('ready', () => {
      console.log('Redis is ready when chat')
    })
    client.on('error', (err) => {
      console.log("Redis' error when start a chat", err)
    })
    await client.connect()
    const list = {}
    list.email = email
    list.data = data

    await client.rPush(`chat:${room}`, JSON.stringify(list))

    await client.quit()
  }
}
