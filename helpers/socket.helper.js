const { redisWrite } = require('./redis.helper')

module.exports = function (io) {
  io.on('connection', (socket) => {
    let person = ''
    socket.on('joinRoom', (classId, userName) => {
      person = userName
      console.log(`${person}join`, classId)
      socket.join(classId)
      socket.to(classId).emit('ready', `${userName}準備通話`)
    })

    socket.on('message', (classId, email, data) => {
      redisWrite(classId, email, data)
      socket.to(classId).emit('message', { email: `${email}`, data: `${data}` })
    })
    socket.on('disconnect', () => {
      console.log(`${person}離開聊天`)
    })
  })
}
