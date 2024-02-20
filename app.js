if ((process.env.NODE_ENV === 'development')) require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const route = require('./routes')
const passport = require('./config/passport')
app.use(express.json())
app.use(passport.initialize())
app.use(route)

app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`)
)
