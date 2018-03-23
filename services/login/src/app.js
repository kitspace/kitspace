const app = require('express')()
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
//const gitlab = new Gitlab('http://localhost:8080/gitlab')
const superagent = require('superagent')

app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
  superagent.get('http://localhost:8080/gitlab/users/sign_in').then(r => {
    const $ = cheerio.load(r.text)
    const authenticity_token = $('input[name=authenticity_token]').attr('value')
    res.send({authenticity_token})
  })
})

app.post('/', (req, res) => {
  console.log(req.body)
})

const agent = superagent.agent()
agent
  .get(`http://localhost:8080/gitlab/users/sign_in`)
  .then(r => {
    const $ = cheerio.load(r.text)
    const authenticity_token = $('input[name=authenticity_token]').attr('value')
    console.log(authenticity_token)
    agent
      .post('http://localhost:8080/gitlab/users/sign_in')
      .send(`authenticity_token=${encodeURIComponent(authenticity_token)}`)
      .send('user[login]=root')
      .send('user[password]=')
      .send('user[remember_me]=0')
      .send('utf8=✓')
      .then(r => {
        console.log(r.text)
      })
    //.catch(e => console.error(e))
  })

module.exports = app
