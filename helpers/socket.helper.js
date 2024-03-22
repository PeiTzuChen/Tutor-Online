const redisWrite = require('./redis.helper')

module.exports = function (io) {
  io.on('connection', (socket) => {
    let person = ''
    socket.on('joinRoom', (roomName, userName) => {
      person = userName
      console.log(`${person}join`, roomName)
      socket.join(roomName)
      socket.to(roomName).emit('ready', `${userName}準備通話`)
    })

    socket.on('message', (roomName, email, data) => {
      redisWrite(roomName, email, data)
      socket.to(roomName).emit('message', { email: `${email}`, data: `${data}` })
    })
    socket.on('disconnect', () => {
      console.log(`${person}離開聊天`)
    })
  })
}
