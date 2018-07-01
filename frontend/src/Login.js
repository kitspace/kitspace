import React from 'react'
import {Link} from 'react-router-dom'
import superagent from 'superagent'
import Gitlab from 'kitspace-gitlab-client'

const gitlab = new Gitlab('/!gitlab')

class Login extends React.Component {
  constructor() {
    super()
    this.state = {authenticity_token: null, password: null, login: null, user: null}
  }
  componentDidMount() {
    superagent
      .get('/!login/api')
      .then(r => r.body.authenticity_token)
      .then(token => this.setState({authenticity_token: token}))
    gitlab
      .getCurrentUser()
      .then(user => this.setState({user}))
      .catch(e => this.setState({user: 'not signed in'}))
  }
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state.user, null, 2)}</pre>
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
            gitlab
              .login(this.state.login, this.state.password)
              .then(r => {
                window.location.href = '/'
              })
              .catch(e => console.error(e))
          }}
        >
          ajax login
        </button>
        <pre>{this.state.authenticity_token}</pre>

        <form action="/gitlab/users/auth/github" method="post">
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
              .get('/!login/api')
              .then(r => r.body.authenticity_token)
              .then(token =>
                superagent
                  .post('/!login/api/github')
                  .send(`authenticity_token=${token}`)
                  .then(r => {
                    window.location.replace(r.body.location)
                  })
              )
          }}
        >
          github api
        </button>
      </div>
    )
  }
}

export default Login
