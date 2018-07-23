const express = require('express')
const next = require('next')
const conf = require('./next.config.js')

const port = parseInt(process.env.PORT, 10) || 1234
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev, conf})
const nextHandler = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use('/login/*', nextHandler)
  server.use('/submit/*', nextHandler)
  server.use('/_next/*', nextHandler)

  server.get('/:namespace/:projectname', (req, res) => {
    app.render(req, res, '/project', req.params)
  })

  server.use('/', nextHandler)

  server.listen(port, err => {
    if (err) throw err
  })
})
