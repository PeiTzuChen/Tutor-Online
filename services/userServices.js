const db = require('../models')
const { User, Student, Teacher } = db
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const transporter = require('../helpers/submail.helper')
const { Op } = require('sequelize')
const newsURL =
  'https://api.worldnewsapi.com/search-news?max-sentiment=-0.4&news-sources=https%3A%2F%2Fwww.huffingtonpost.co.uk&language=en&api-key=6484fc4f42a748e99e4db84f3bf6fc4a'
const axios = require('axios')
const userController = {
  signup: (req, cb) => {
    const { email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      const err = new Error('Password do not match!')
      err.status = 409
      throw cb(err)
    }
    if (!(email && password)) {
      const err = new Error('email or password is necessary')
      err.status = 422
      throw cb(err)
    }
    User.findOne({
      where: { email }
    })
      .then((user) => {
        if (user) {
          const err = new Error('Email already exists!')
          err.status = 409
          throw err
        }
        return bcrypt.hash(password, 10)
      })
      .then((hash) => {
        return User.create({
          email,
          password: hash
        })
      })
      .then((user) => cb(null, user))
      .catch((err) => {
        return cb(err)
      })
  },
  signIn: (req, cb) => {
    try {
      const user = req.user
      delete user.password
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      )
      return cb(null, token)
    } catch (err) {
      return cb(err)
    }
  },
  GoogleSignIn: (req, cb) => {
    const CLIENT_ID =
      '303422650660-1vqckog59tsnnvf423324ni7uepcpu4f.apps.googleusercontent.com'
    const client = new OAuth2Client(CLIENT_ID)
    const token = req.body.token

    client.setCredentials({ access_token: token })

    client
      .request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo'
      })
      .then((response) => {
        if (!response) {
          const err = new Error('Google authenticate failed')
          err.status = 400
          throw cb(err)
        }
        const email = response.data.email
        User.findOne({
          where: { email }
        })
          .then((user) => {
            if (user) return user

            const randomPwd = Math.random().toString(36).slice(-8)
            return bcrypt.hash(randomPwd, 10).then((hash) => {
              return User.create({
                email,
                password: hash
              })
            })
          })
          .then((user) => {
            client.revokeCredentials()
            req.user = user
            delete user.password
            const token = jwt.sign(
              {
                id: user.id,
                email: user.email
              },
              process.env.JWT_SECRET,
              { expiresIn: '30d' }
            )
            return cb(null, token)
          })
      })
      .catch((err) => cb(err))
  },
  getUsers: (req, cb) => {
    User.findAll({
      raw: true,
      nest: true,
      attributes: ['id', 'email', 'studentId', 'teacherId'],
      where: { isAdmin: false },
      include: [
        { model: Student, attributes: ['name'] },
        { model: Teacher, attributes: ['name'] }
      ]
    })
      .then((users) => {
        users.length < 1
          ? cb(null, "doesn't have users data yet")
          : cb(null, users)
      })
      .catch((err) => cb(err))
  },
  subMail: (req, cb) => {
    const userId = req.params.userId
    const { subMail } = req.body
    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          const err = new Error("The User doesn't exist")
          err.status = 400
          throw err
        }
        return user.update({
          subMail
        })
      })
      .then((user) => cb(null, user))
      .catch((err) => cb(err))
  },
  sendMail: (req, cb) => {
    const userId = req.params.userId
    User.findByPk(userId, { raw: true })
      .then((user) => {
        if (!user.isAdmin) {
          const err = new Error('permission denied')
          err.status = 401
          throw err
        }
        return Promise.all([
          User.findAll({ raw: true, where: { subMail: { [Op.not]: null } } }),
          axios.get(newsURL)
        ])
      })
      .then(([users, response]) => {
        const topic = response.data.news[0].title
        const image = response.data.news[0].image
        const author = response.data.news[0].author
        const text = response.data.news[0].text
        const subscriber = users.map((user) => user.subMail).join()
        const mailOptions = {
          from: process.env.USER_EMAIL,
          to: subscriber,
          subject: '電子報',
          html: `<h1>${topic}</h1>   <h3>${author}</h3>  <p>${text}</p>
          <img src=${image}>`
        }

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            err.message = '傳送信件失敗'
            cb(err)
          } else {
            cb(null, '傳送信件成功')
          }
        })
      })
      .catch((err) => {
        cb(err)
      })
  }
}
module.exports = userController
