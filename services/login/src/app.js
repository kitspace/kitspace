const app = require('express')()
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
//const gitlab = new Gitlab('http://localhost:8080/gitlab')
const superagent = require('superagent')
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.get('/', (req, res) => {
  const p = superagent.get('http://localhost:8080/gitlab/users/sign_in')
  if (req.cookies._gitlab_session) {
    p.set('cookie', `_gitlab_session=${req.cookies._gitlab_session}`)
  }
  p.then(r => {
    if (r.headers['set-cookie']) {
      res.set('set-cookie', r.headers['set-cookie'])
    }
    const $ = cheerio.load(r.text)
    const authenticity_token = $('input[name=authenticity_token]').attr('value')
    res.send({authenticity_token})
  })
})

app.post('/', (req, res) => {
  const p = superagent
    .post('http://localhost:8080/gitlab/users/sign_in')
    .redirects(0)
    .send(`authenticity_token=${encodeURIComponent(req.body.authenticity_token)}`)
    .send(`user[login]=${req.body['user[login]']}`)
    .send(`user[password]=${req.body['user[password]']}`)
    .send('user[remember_me]=0')
    .send('utf8=✓')
  if (req.cookies._gitlab_session) {
    p.set('cookie', `_gitlab_session=${req.cookies._gitlab_session}`)
  }
  p.catch(e => {
    if (e.status === 302) {
      res.set('set-cookie', e.response.headers['set-cookie'])
      res.redirect('/')
    } else {
      res.status(e.status)
    }
  })
})

module.exports = app
