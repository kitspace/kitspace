import React from 'react'
import superagent from 'superagent'
import Gitlab from '@kitspace/gitlab-client'
import {withRouter} from 'next/router'

class Login extends React.Component {
  state = {authenticity_token: '', password: '', username: ''}
  static async getInitialProps({query: {after}}) {
    return {after}
  }
  componentDidMount() {
    superagent
      .get('/!login/api')
      .then(r => r.body.authenticity_token)
      .then(token => this.setState({authenticity_token: token}))
  }
  render() {
    return (
      <>
        <div>
          <pre>{JSON.stringify(this.props.user, null, 2)}</pre>
          <input
            onChange={e => this.setState({username: e.target.value})}
            id="username"
            name="username"
            value={this.state.username}
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
              const {username, password, authenticity_token} = this.state
              superagent
                .post('/!login/api')
                .send(
                  `authenticity_token=${encodeURIComponent(authenticity_token)}`,
                )
                .send(`user[login]=${encodeURIComponent(username)}`)
                .send(`user[password]=${encodeURIComponent(password)}`)
                .send('user[remember_me]=0')
                .send('utf8=✓')
                .then(user => {
                  this.props.router.push(this.props.after || '/')
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
      </>
    )
  }
}

function setCookie(name, value, minutes = 3) {
  const date = new Date()
  date.setTime(date.getTime() + minutes * 60 * 1000)
  const expires = '; expires=' + date.toUTCString()
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

export default withRouter(Login)
