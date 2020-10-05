const proxy = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(proxy('/song', {
    target: 'http://localhost:8888',
    secure: false
  }))
}
