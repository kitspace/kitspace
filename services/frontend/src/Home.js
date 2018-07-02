import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {Link} from 'react-router-dom'

const QUERY = gql`
  {
    projects {
      id
      name
    }
  }
`

function Home(props) {
  const {data} = props
  return (
    <div className="Home">
      <pre>{JSON.stringify(data.projects, null, 2)}</pre>
    </div>
  )
}

export default graphql(QUERY)(Home)
