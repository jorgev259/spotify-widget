require('dotenv').config()
const express = require('express')
const path = require('path')
const open = require('open')
const SpotifyWebApi = require('spotify-web-api-node')
const crypto = require('crypto')

const { app: electronApp, Menu, Tray } = require('electron')
let timeout

let tray = null
electronApp.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon_warn.png'))
  tray.setTitle('Spotify Widget')
})

function setLogged () {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Spotify Widget', enabled: false },
    { type: 'separator' },
    { label: 'Logout', click: () => open('https://spotify.com/logout').then(setLoggedOut) },
    { role: 'quit' }
  ])

  tray.setImage(path.join(__dirname, 'icon.png'))
  tray.setToolTip('Spotify Widget')
  tray.setContextMenu(contextMenu)
}

function setLoggedOut () {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Spotify Widget (Not logged in)', enabled: false },
    { type: 'separator' },
    { label: 'Authorize', click: () => open(spotifyApi.createAuthorizeURL(['user-read-currently-playing'], crypto.randomBytes(20).toString('hex'))) },
    { role: 'quit' }
  ])

  tray.setImage(path.join(__dirname, 'icon_warn.png'))
  tray.setToolTip('Spotify Widget (Not logged in)')
  tray.setContextMenu(contextMenu)
}

var app = express()
const port = process.env.PORT || 8888

const spotifyApi = new SpotifyWebApi({
  redirectUri: 'http://localhost:8888/callback',
  clientSecret: process.env.CLIENT_SECRET,
  clientId: process.env.CLIENT_ID
})

spotifyApi.getMe().then(result => {
  setLogged()
}).catch(err => {
  setLoggedOut()
  console.log(err)
})

app.use(express.static(path.join(__dirname, '/client/build')))

app.get('/song', function (req, res) {
  spotifyApi.getMyCurrentPlayingTrack()
    .then(result => res.send(result))
    .catch(err => {
      console.log(err)
    })
})

app.get('/callback', (req, res) => {
  spotifyApi.authorizationCodeGrant(req.query.code).then(
    function (data) {
      spotifyApi.setAccessToken(data.body.access_token)
      spotifyApi.setRefreshToken(data.body.refresh_token)

      clearTimeout(timeout)
      timeout = setTimeout(refresh, (data.body.expires_in - 300) * 1000)
      setLogged()
      res.redirect('/')
    },
    function (err) {
      res.send(err.message)
      console.log('Something went wrong!', err)
    }
  )
})

app.listen(port, function () {
  console.log('App is listening on port ' + port)
})

function refresh (req, res, next) {
  spotifyApi.refreshAccessToken().then(
    function (data) {
      console.log(data.body)
      console.log('The access token has been refreshed!')

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body.access_token)
      clearTimeout(timeout)
      timeout = setTimeout(refresh, (data.body.expires_in - 300) * 1000)
      next()
    },
    function (err) {
      console.log('Could not refresh access token', err)
      next(err)
    }
  )
}
