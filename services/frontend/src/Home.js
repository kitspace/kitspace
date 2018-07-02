import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import superagent from 'superagent'

const KITSPACE_DOMAIN = process.env.KITSPACE_DOMAIN
const KITSPACE_PORT = process.env.KITSPACE_PORT
const KITSPACE_GITLAB_PATH = process.env.KITSPACE_GITLAB_PATH

class Home extends Component {
  state = {user: null}
  static getInitialProps({req, res, match, history, location, ...ctx}) {
    return superagent
      .get(
        `${KITSPACE_DOMAIN}:${KITSPACE_PORT}/${KITSPACE_GITLAB_PATH}/api/v4/user`
      )
      .set({cookie: req.headers.cookie})
      .then(r => ({user: r.body}))
      .catch(e => ({user: 'not signed in'}))
  }
  componentDidMount() {
    superagent.get('/!gitlab/api/v4/user').then(r => this.setState({user: r.body}))
  }
  render() {
    const user = this.state.user || this.props.user
    return (
      <div>
        {(() => {
          if (user !== 'not signed in') {
            return (
              <button
                onClick={() => {
                  superagent.get('/!login/api/sign_out').then(r => {
                    window.location.replace('/login')
                  })
                }}
              >
                sign out
              </button>
            )
          }
        })()}
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    )
  }
}

export default Home
