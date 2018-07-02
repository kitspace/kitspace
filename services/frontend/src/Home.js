import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {Link} from 'react-router-dom'
import superagent from 'superagent'

const QUERY = gql`
  query {
    user {
      username
    }
    projects {
      id
      path_with_namespace
    }
  }
`

function Home(props) {
  const {user, error, loading, projects} = props.data
  console.error(error)
  return (
    <div className="Home">
      <pre>{(user || {}).username}</pre>
      {(() => {
        if (user) {
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

      <pre>{JSON.stringify(projects, null, 2)}</pre>
    </div>
  )
}

export default graphql(QUERY, {
  options: {errorPolicy: 'all', ssr: false},
})(Home)
