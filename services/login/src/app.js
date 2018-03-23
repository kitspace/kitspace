const app = require('express')()
const cheerio = require('cheerio')
//const gitlab = new Gitlab('http://localhost:8080/gitlab')
const superagent = require('superagent')

app.get('/login', (req, res) => {
  superagent.get('http://localhost:8080/gitlab/users/sign_in').then(r => {
    const $ = cheerio.load(r.text)
    const token = $('input[name=authenticity_token]').attr('value')
    res.send(token)
  })
})

module.exports = app
