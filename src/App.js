import React from 'react'
import { useRoutes } from 'hookrouter'
import Small from './Small'

const routes = {
  '/': () => <Small station='clouds' />,
  '/:station': ({ station }) => <Small station={station} />
}

const App = () => {
  return useRoutes(routes)
}

export default App
