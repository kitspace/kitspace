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
  server.use('/settings/*', nextHandler)
  server.use('/about/*', nextHandler)

  server.use('/error/:statusCode', customHandler('/error_page'))

  server.get('/:namespace/:projectname', customHandler('/project'))

  server.use('/', nextHandler)

  server.listen(port, err => {
    if (err) {
      console.error(err)
    }
  })
})

function customHandler(page) {
  return (req, res) =>
    app.render(req, res, page, Object.assign({}, req.params, req.query))
}
