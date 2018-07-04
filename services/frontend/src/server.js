import React from 'react'
import express from 'express'
import {render} from '@kitspace/after'
import {renderToString} from 'react-dom/server'
import {ApolloProvider, getDataFromTree} from 'react-apollo'
import routes from './routes'
import createApolloClient from './createApolloClient'
import Document from './Document'
import cookieParser from 'cookie-parser'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use('/!gitlab/*', cookieParser(), (req, res) => {
    const oauthLoginRedirect = req.cookies.oauthLoginRedirect
    if (oauthLoginRedirect && oauthLoginRedirect !== 'done') {
      res.cookie('oauthLoginRedirect', 'done')
      return res.redirect(oauthLoginRedirect)
    }
    return res.redirect('/')
  })
  .get('/*', async (req, res) => {
    const client = createApolloClient({ssrMode: true, cookie: req.headers.cookie})
    const customRenderer = node => {
      const App = <ApolloProvider client={client}>{node}</ApolloProvider>
      return getDataFromTree(App).then(() => {
        const initialApolloState = client.extract()
        const html = renderToString(App)
        return {html, initialApolloState}
      })
    }

    try {
      const html = await render({
        req,
        res,
        routes,
        assets,
        customRenderer,
        document: Document,
      })
      res.send(html)
    } catch (error) {
      console.error(error)
      res.json({message: error.message, stack: error.stack})
    }
  })

export default server
