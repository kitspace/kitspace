const app = require('express')()
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
const superagent = require('superagent')
const cookieParser = require('cookie-parser')

require('dotenv').config({path: '../../.env'})

const {KITSPACE_DOMAIN, KITSPACE_PORT, KITSPACE_GITLAB_PATH} = process.env

app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())


app.get('/', (req, res) => {
  const p = superagent.get(`${KITSPACE_DOMAIN}:${KITSPACE_PORT}/${KITSPACE_GITLAB_PATH}/users/sign_in`)
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
app.get('//github', (req, res) => {
  res.send('ok')
})

app.post('//github', (req, res) => {
  console.log(req.url)
  const p = superagent
    .post(`${KITSPACE_DOMAIN}:${KITSPACE_PORT}/${KITSPACE_GITLAB_PATH}/users/auth/github`)
    .redirects(0)
    .send(`authenticity_token=${encodeURIComponent(req.body.authenticity_token)}`)
  if (req.headers.cookie) {
    p.set('cookie', req.headers.cookie)
  }
  p.catch(e => {
    console.log('error', e.status)
    if (e.status === 302) {
      if (e.response.headers['set-cookie']) {
        res.set('set-cookie', e.response.headers['set-cookie'])
      }
      console.log('location', e.response.headers.location)
      res.send({location: e.response.headers.location})
    } else {
      res.sendStatus(e.status)
    }
  })
})

app.get('//sign_out', (req, res) => {
  const p = superagent
    .get(`${KITSPACE_DOMAIN}:${KITSPACE_PORT}/${KITSPACE_GITLAB_PATH}/users/sign_out`)
    .send(`authenticity_token=${encodeURIComponent(req.body.authenticity_token)}`)
  if (req.cookies._gitlab_session) {
    p.set('cookie', `_gitlab_session=${req.cookies._gitlab_session}`)
  }
  p.then(r => res.send('ok'))
  p.catch(e => res.sendStatus(e.status))
})

app.post('/', (req, res) => {
  const p = superagent
    .post(`${KITSPACE_DOMAIN}:${KITSPACE_PORT}/${KITSPACE_GITLAB_PATH}/users/sign_in`)
    .redirects(0)
    .send(`authenticity_token=${encodeURIComponent(req.body.authenticity_token)}`)
    .send(`user[login]=${req.body['user[login]']}`)
    .send(`user[password]=${req.body['user[password]']}`)
    .send('user[remember_me]=0')
    .send('utf8=✓')
  if (req.cookies._gitlab_session) {
    p.set('cookie', `_gitlab_session=${req.cookies._gitlab_session}`)
  }
  p.then(r => {
    console.log({r})
    res.set('set-cookie', r.headers['set-cookie'])
    res.send(r.text)
  })
  p.catch(e => {
    if (e.status === 302) {
      res.set('set-cookie', e.response.headers['set-cookie'])
      res.redirect('/')
    } else {
      res.sendStatus(e.status)
    }
  })
})

function trace(x) {
  console.log(x)
  return x
}


module.exports = app
