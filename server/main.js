var express = require('express')
var session = require('express-session')
var MemoryStore = require('memorystore')(session)

const path = require('path')
const { stringify } = require('query-string')

require('dotenv').config()

var port = 8888
var authCallbackPath = '/auth/spotify/callback'

/*
{
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:' + port + authCallbackPath
    }
*/

var app = express()
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: process.env.SECRET
}))

app.use(express.static(path.join(__dirname, '../client/build')))

app.get('/me', ensureAuthenticated, function (req, res) {
  console.log(req.session.user)
  res.send(req.session.user)
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

app.listen(port, function () {
  console.log('App is listening on port ' + port)
})

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated (req, res, next) {
  console.log(req.session)
  if (req.session.user) return next()
  res.redirect('/auth/spotify')
}
