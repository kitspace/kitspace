import React from 'react'
import express from 'express'
import {render} from '@kitspace/after'
import {renderToString} from 'react-dom/server'
import cookieParser from 'cookie-parser'
import routes from './routes'
import createUrqlClient from './createUrqlClient'
import Document from './Document'

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
    const urql = createUrqlClient({ssrMode: true})

    function customRenderer(node) {
      const html = renderToString(node)
      return {html, initialUrqlStore: urql.store}
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
