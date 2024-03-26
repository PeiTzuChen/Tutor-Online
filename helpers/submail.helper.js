const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2Client = google.auth.OAuth2

const getAccessToken = async () => {
  const oauth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  })
  // getToken 是拿到 Authorization Grant 之後，透過getToken(req.query.code)拿refresh token & access token， getAccessToken是已經有refresh token可以直接用此method拿access token
  return await oauth2Client.getAccessToken(function (err, accessToken) {
    if (err) {
      console.error('Error getting access token:', err)
    }
  })
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.USER_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: getAccessToken()
  }
})

module.exports = transporter
