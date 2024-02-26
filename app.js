if ((process.env.NODE_ENV === 'development')) require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const route = require('./routes')
const passport = require('./config/passport')
const { deleteFiles } = require('./helpers/file.helper')
app.use(express.json())
app.use(passport.initialize())
setInterval(deleteFiles, 3600000) // 每一小時刪除暫存temp資料
app.use(route)

app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`)
)
