const { createClient } = require('redis')
const client = createClient({
  url: `redis://${process.env.REDIS_IP}:${process.env.REDIS_PORT}`
  // for docker
  // url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  // password: process.env.REDIS_PASSWORD // for Zeabur
})

// named func instead of anonymous func in order to remove listener and preventing potential memory leaks
const onReady = () => {
  console.log('Redis is ready')
}

const onError = (err) => {
  console.log("Redis' error", err)
}

const redisOpen = async () => {
  client.on('ready', onReady)
  client.on('error', onError)
  await client.connect()
}

const redisClose = () => {
  client.removeListener('ready', onReady)
  client.removeListener('error', onError)
  client.quit()
}

module.exports = {
  redisWrite: async (classId, email, data) => {
    console.log('進入redisWrite')
    await redisOpen()
    const list = {}
    list.email = email
    list.data = data

    await client.rPush(`chat:${classId}`, JSON.stringify(list))
    console.log('寫入訊息', data)
    await redisClose()
  },
  redisRead: async (classId) => {
    console.log('進入redisRead')
    await redisOpen(classId)
    const chat = await client.lRange(`chat:${classId}`, 0, -1)
    console.log('讀歷史訊息 回傳chat', chat)
    await redisClose()
    return chat
  }
}
