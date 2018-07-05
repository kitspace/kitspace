import React from 'react'
import {graphql, Query} from 'react-apollo'
import gql from 'graphql-tag'
import {Link, Redirect} from 'react-router-dom'
import superagent from 'superagent'

const QUERY = gql`
  query {
    user {
      username
      avatar_url
    }
    projects {
      id
      path_with_namespace
    }
  }
`

export default function Home(props) {
  return (
    <Query query={QUERY}>
      {({client, history, data: {user, projects}}) => {
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
                        client.resetStore()
                        props.history.push('/login')
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
      }}
    </Query>
  )
}
