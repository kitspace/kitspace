import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {Redirect} from 'react-router-dom'
import superagent from 'superagent'
import Gitlab from 'kitspace-gitlab-client'

const gitlab = new Gitlab('/!gitlab')

const QUERY = gql`
  query {
    user {
      username
      avatar_url
    }
  }
`

class Login extends React.Component {
  constructor() {
    super()
    this.state = {authenticity_token: '', password: '', login: ''}
  }
  componentDidMount() {
    superagent
      .get('/!login/api')
      .then(r => r.body.authenticity_token)
      .then(token => this.setState({authenticity_token: token}))
  }
  render() {
    const referrer = (this.props.location.state || {}).referrer
    return (
      <div>
        <pre>{JSON.stringify(this.props.data.user, null, 2)}</pre>
        <input
          onChange={e => this.setState({login: e.target.value})}
          id="login"
          name="login"
          value={this.state.login}
        />
        <input
          onChange={e => {
            this.setState({password: e.target.value})
          }}
          type="password"
          id="password"
          name="password"
          value={this.state.password}
        />
        <button
          onClick={() => {
            const {login, password, authenticity_token} = this.state
            superagent
              .post('/!login/api')
              .send(`authenticity_token=${encodeURIComponent(authenticity_token)}`)
              .send(`user[login]=${encodeURIComponent(login)}`)
              .send(`user[password]=${encodeURIComponent(password)}`)
              .send('user[remember_me]=0')
              .send('utf8=✓')
              .then(r => {
                if (r.body.success) {
                  this.props.history.push(referrer || '/')
                } else {
                  console.error(r.body)
                }
              })
              .catch(e => console.error(e))
          }}
        >
          ajax login
        </button>
        <pre>{this.state.authenticity_token}</pre>

        <form
          action="/!gitlab/users/auth/github"
          method="post"
          onSubmit={e => {
            if (referrer) {
              setCookie('oauthLoginRedirect', referrer)
            }
          }}
        >
          <input
            type="hidden"
            name="authenticity_token"
            value={this.state.authenticity_token}
          />
          <input type="submit" value="Github" />
        </form>
      </div>
    )
  }
}

function setCookie(name, value, minutes = 3) {
  let expires = ''
  const date = new Date()
  date.setTime(date.getTime() + minutes * 60 * 1000)
  expires = '; expires=' + date.toUTCString()
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

function trace(x) {
  console.log(x)
  return x
}

export default graphql(QUERY, {
  options: {errorPolicy: 'all'},
})(Login)
