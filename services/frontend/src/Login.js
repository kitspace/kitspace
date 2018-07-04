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
    this.state = {authenticity_token: null, password: null, login: null}
  }
  componentDidMount() {
    this.props.data.refetch()
    superagent
      .get('/!login/api')
      .then(r => r.body.authenticity_token)
      .then(token => this.setState({authenticity_token: token}))
  }
  render() {
    const referrer = (this.props.location.state || {}).referrer
    if (this.props.data.user) {
      return <Redirect to={referrer || '/'} />
    }
    return (
      <div>
        <pre>{JSON.stringify(this.props.data.user, null, 2)}</pre>
        <pre>{JSON.stringify(this.props.location)}</pre>
        <form action="/!login/api" method="post">
          <label htmlFor="user_login" required="required">
            Username or email
          </label>
          <input id="user_login" name="user[login]" />
          <label htmlFor="user_password" required="required">
            Password
          </label>
          <input type="password" id="user_password" name="user[password]" />
          <input
            type="hidden"
            name="authenticity_token"
            value={this.state.authenticity_token}
          />
          <input type="submit" value="Login" />
        </form>
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
              .then(r => this.props.data.refetch())
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
        <button
          onClick={() => {
            superagent
              .post('/!gitlab/users/auth/github')
              .send(`authenticity_token=${this.state.authenticity_token}`)
              .then(r => {
                this.props.data.refetch()
              })
          }}
        >
          github api
        </button>
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
