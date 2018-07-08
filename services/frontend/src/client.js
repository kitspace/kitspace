import React from 'react'
import {hydrate} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {ensureReady, After} from '@kitspace/after'
import {Provider as UrqlProvider} from '@kitspace/urql'
import routes from './routes'
import createUrqlClient from './createUrqlClient'

const urql = createUrqlClient({ssrMode: false})

ensureReady(routes).then(data =>
  hydrate(
    <UrqlProvider client={urql}>
      <BrowserRouter>
        <After data={data} routes={routes} />
      </BrowserRouter>
    </UrqlProvider>,
    document.getElementById('root'),
  ),
)
if (module.hot) {
  module.hot.accept()
}
