const express = require('express')
const next = require('next')
const conf = require('./next.config.js')
const dotenv = require('dotenv').config({path: '../../.env'})
const Gitlab = require('@kitspace/gitlab-client')

const port = parseInt(process.env.PORT, 10) || 1234
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev, conf})
const nextHandler = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.all('/login/*', nextHandler)
  server.all('/submit', (req, res) => res.redirect(301, '/new'))
  server.all('/new', nextHandler)
  server.all('/about/*', nextHandler)
  server.all('/_next/*', nextHandler)
  server.all('/static/*', nextHandler)
  server.all('/settings/*', nextHandler)

  server.all('/settings', protected(nextHandler))

  server.get('/error/:statusCode', customHandler('/error_page'))
  server.get('/:namespace/:projectname', customHandler('/project'))

  server.all('*', nextHandler)

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

function protected(handler) {
  return (req, res) => {
    getUser(req).then(user => {
      if (user) {
        return handler(req, res)
      } else {
        return res.redirect('/login')
      }
    })
  }
}

function getUser(req) {
  const cookie = req ? req.headers.cookie : null
  const url =
    process.env.KITSPACE_DOMAIN + ':' + process.env.KITSPACE_PORT + '/!gitlab'
  const gitlab = new Gitlab(url, null, cookie)
  return gitlab.getCurrentUser()
}
