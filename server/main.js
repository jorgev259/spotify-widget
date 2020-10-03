var express = require('express')
var session = require('express-session')
var passport = require('passport')
var SpotifyStrategy = require('passport-spotify').Strategy
const path = require('path')

require('dotenv').config()

var port = 8888
var authCallbackPath = '/auth/spotify/callback'

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, expires_in
//   and spotify profile), and invoke a callback with a user object.
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:' + port + authCallbackPath
    },
    function (accessToken, refreshToken, expiresIn, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        return done(null, profile)
      })
    }
  )
)

var app = express()

app.use(
  session({ secret: process.env.SECRET, resave: true, saveUninitialized: true })
)
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, '../client/build')))

app.get('/player', ensureAuthenticated, function (req, res) {
  console.log(req.user)
  res.render('index.html')
})

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-currently-playing'],
    showDialog: true
  })
)

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  authCallbackPath,
  passport.authenticate('spotify', { failureRedirect: '/auth/spotify' }),
  function (req, res) {
    res.redirect('/')
  }
)

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
  console.log(req.user)
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/auth/spotify')
}
