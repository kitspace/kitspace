import React from 'react'
import {Redirect} from 'react-router-dom'
import superagent from 'superagent'
import Gitlab from 'kitspace-gitlab-client'
import * as urql from '@kitspace/urql'
import fetchQuery from './fetchQuery'

const gitlab = new Gitlab('/!gitlab')

const QUERY = /* GraphQL */ `
  query {
    user {
      username
      avatar_url
    }
  }
`

const MUTATION = /* GraphQL */ `
  mutation($username: String!, $password: String!, $authenticity_token: String!) {
    login(
      username: $username
      password: $password
      authenticity_token: $authenticity_token
    ) {
      username
    }
  }
`

class Login extends React.Component {
  static async getInitialProps({urql}) {
    if (urql) {
      return fetchQuery(urql, QUERY)
    }
  }
  constructor() {
    super()
    this.state = {authenticity_token: '', password: '', username: ''}
  }
  componentDidMount() {
    superagent
      .get('/!login/api')
      .then(r => r.body.authenticity_token)
      .then(token => this.setState({authenticity_token: token}))
  }
  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }
    const referrer = (this.props.location.state || {}).referrer
    if (this.props.data.user) {
      return <Redirect to={referrer || '/'} />
    }
    const {login, refetch} = this.props
    return (
      <div>
        <pre>{JSON.stringify(this.props.data.user, null, 2)}</pre>
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
              .send(`authenticity_token=${encodeURIComponent(authenticity_token)}`)
              .send(`user[login]=${encodeURIComponent(username)}`)
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
        <button
          onClick={() => {
            const {username, password, authenticity_token} = this.state
            login({username, password, authenticity_token}).then(() => {
              // XXX this shouldn't be needed
              refetch({skipCache: true})
            })
          }}
        >
          graphql login
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
  const date = new Date()
  date.setTime(date.getTime() + minutes * 60 * 1000)
  const expires = '; expires=' + date.toUTCString()
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

function trace(x) {
  console.log(x)
  return x
}

export default urql.ConnectHOC({
  query: urql.query(QUERY),
  mutation: {
    login: urql.mutation(MUTATION),
  },
})(Login)
