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
  const {data} = props
  return (
    <div className="Home">
      <pre>{(data.user || {}).username}</pre>
      {(() => {
        if (data.user) {
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

      <pre>{JSON.stringify(data.projects, null, 2)}</pre>
    </div>
  )
}

export default graphql(QUERY)(Home)
