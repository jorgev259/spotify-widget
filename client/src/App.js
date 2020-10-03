import React from 'react'
import queryString from 'query-string'
import Widget from './Widget.js'

import 'bootstrap/dist/css/bootstrap.min.css'

function refresh () {
  const query = {
    client_id: 'c1f25cc2ba994711a0666c9bfeef8300',
    response_type: 'token',
    redirect_uri: 'http://localhost:3000',
    scope: 'user-read-currently-playing',
    state: 123
  }

  const url = queryString.stringifyUrl({ url: 'https://accounts.spotify.com/authorize', query })
  window.location.href = url
}

export default function App () {
  const parsed = queryString.parse(window.location.hash)
  console.log(parsed)

  if (!parsed.state) refresh()
  if (!parsed.access_token) return (<h1>401 Unauthorized</h1>)

  return (
    <Widget refresh={refresh} hash={parsed} />
  )
}
