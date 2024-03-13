module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'tutor_online',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+08:00'
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_ROOT_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql'
  }
}
