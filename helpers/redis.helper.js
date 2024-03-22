const { createClient } = require('redis')
const client = createClient({
  // url: `redis://${process.env.REDIS_IP}:${process.env.REDIS_PORT}`
  // for docker
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD // for Zeabur
})

const redisOpen = async () => {
  client.on('ready', () => {
    console.log('Redis is ready')
  })
  client.on('error', (err) => {
    console.log("Redis' error", err)
  })
  await client.connect()
}

module.exports = {
  redisWrite: async (roomName, email, data) => {
    console.log('進入redisWrite')
    await redisOpen()
    const list = {}
    list.email = email
    list.data = data

    await client.rPush(`chat:${roomName}`, JSON.stringify(list))
    console.log('寫入訊息', data)
    await client.quit()
  },
  redisRead: async (roomName) => {
    console.log('進入redisRead')
    await redisOpen(roomName)
    const chat = await client.lRange(`chat:${roomName}`, 0, -1)
    console.log('讀歷史訊息 回傳chat', chat)
    await client.quit()
    return chat
  }
}
