const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2Client = google.auth.OAuth2

const createTransporter = () => {
  const oauth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  })
  // getToken 是拿到 Authorization Grant 之後，透過getToken(req.query.code)拿refresh token & access token， getAccessToken是已經有refresh token可以直接用此method拿access token
  return new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, accessToken) => {
      if (err) {
        console.log('get access token failed', err)
        reject(err)
      }
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.USER_EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken
        }
      })
      resolve(transporter)
    })
  })
}

module.exports = createTransporter
