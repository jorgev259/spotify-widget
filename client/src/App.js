import React from 'react'
import queryString from 'query-string'
import Widget from './Widget.js'

import 'bootstrap/dist/css/bootstrap.min.css'

export default function App () {
  const parsed = queryString.parse(window.location.hash)
  console.log(parsed)

  return (
    <Widget hash={parsed} />
  )
}
