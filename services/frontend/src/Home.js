import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import superagent from 'superagent'
import * as urql from '@kitspace/urql'
import fetchQuery from './fetchQuery'

const QUERY = /* GraphQL */ `
  query {
    user {
      username
      avatar_url
    }
    projects {
      id
      path_with_namespace
      wiki_enabled
    }
  }
`

class Home extends React.Component {
  static async getInitialProps({urql}) {
    if (urql) {
      return fetchQuery(urql, QUERY)
    }
  }
  render() {
    const {loaded, data, refetch, history} = this.props
    if (!loaded) {
      return <div>Loading...</div>
    }
    const {user, projects} = data
    return (
      <div className="Home">
        <pre>{(user || {}).username}</pre>
        <ul>
          <li>
            <Link to="/login">login</Link>
          </li>
          <li>
            <Link to="/settings">settings</Link>
          </li>
        </ul>
        {(() => {
          if (user) {
            return (
              <button
                onClick={() => {
                  superagent.get('/!login/api/sign_out').then(r => {
                    history.push('/login')
                  })
                }}
              >
                sign out
              </button>
            )
          }
        })()}

        <pre>{JSON.stringify(projects, null, 2)}</pre>
      </div>
    )
  }
}

export default urql.ConnectHOC({query: urql.query(QUERY)})(Home)
