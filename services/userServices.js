const db = require('../models')
const { User, Student, Teacher } = db
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')

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
    const CLIENT_ID = '303422650660-1vqckog59tsnnvf423324ni7uepcpu4f.apps.googleusercontent.com'
    const client = new OAuth2Client(CLIENT_ID)
    const token = req.body.token

    client.setCredentials({ access_token: token })

    client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    })
      .then((response) => {
        console.log('response', response)
        const email = response.data.email
        User.findOne({
          where: { email }
        }).then(user => {
          if (user) return user

          const randomPwd = Math.random().toString(36).slice(-8)
          return bcrypt
            .hash(randomPwd, 10)
            .then(hash => {
              return User.create({
                email,
                password: hash
              })
            })
        }).then(user => {
          client.revokeCredentials()
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
        if (users.length < 1) {
          const err = new Error('no users data')
          err.status = 404
          throw err
        }
        return cb(null, users)
      })
      .catch((err) => cb(err))
  }
}

module.exports = userController
