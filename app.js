if ((process.env.NODE_ENV === 'development')) require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const route = require('./routes')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const passport = require('./config/passport')
app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(route)

app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`)
)
