if ((process.env.NODE_ENV === 'development')) require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 3000
const route = require('./routes')
const passport = require('./config/passport')
const server = http.Server(app)
const { Server } = require('socket.io')
const path = require('path')
const { clientErrorHandler } = require('./middlewares/errorHandler')
const socketHelper = require('./helpers/socket.helper')
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

app.use(express.json())
app.use(passport.initialize())
app.use(route)

const io = new Server(server, {
  cors: {
    // origin: 'https://kingfish-generous-sharply.ngrok-free.app',
    origin: 'https://tutoring-platform-becky.vercel.app',
    method: ['GET', 'POST'],
    allowedHeaders: ['ngrok-skip-browser-warning']
  }
})
socketHelper(io)

// const nodemailer = require('nodemailer')
// const { google } = require('googleapis')
// const OAuth2Client = google.auth.OAuth2

// const getAccessToken = async () => {
//   const oauth2Client = new OAuth2Client(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URI
//   )

//   oauth2Client.setCredentials({
//     refresh_token: process.env.REFRESH_TOKEN
//   })
//   // getToken 是拿到 Authorization Grant 之後，透過getToken(req.query.code)拿refresh token & access token， getAccessToken是已經有refresh token可以直接用此method拿access token
//   return await oauth2Client.getAccessToken(function (err, accessToken) {
//     if (err) {
//       console.error('Error getting access token:', err)
//     }
//   })
// }

// const sendMail = () => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: 'OAuth2',
//       user: process.env.USER_EMAIL,
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       refreshToken: process.env.REFRESH_TOKEN,
//       accessToken: getAccessToken()
//     }
//   })

//   const mailOptions = {
//     from: process.env.USER_EMAIL,
//     to: 'beckychen0923@gmail.com, prettysna@hotmail.com',
//     subject: 'Becky要跟你說',
//     // html: '<h1>某檔投資報酬率高達2000倍</h1><a href="https://www.gettyimages.hk/detail/%E6%8F%92%E5%9C%96/one-million-dollar-currency-%E5%85%8D%E7%89%88%E7%A8%85%E6%8F%92%E5%9C%96/1166159174?adppopup=true">點擊索取超過2000倍的投資報酬</a>',
//     attachments: [
//       {
//         filename: 'photo.jpg',
//         path: './upload/photo.jpg'
//       }
//     ]
//   }

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.error('傳送信件失敗', err)
//     } else {
//       console.log('傳送信件成功', info)
//     }
//   })
// }

// sendMail()

app.use(clientErrorHandler)
server.listen(port, () =>
  console.log(`server listening on http://localhost:${port}`)
)

module.exports = app
