import {query} from 'urquelle'

export default function fetchQuery(urqlClient, QUERY, vars) {
  const q = query(QUERY, vars)
  return urqlClient.executeQuery(q).then(props => {
    if (props.error) {
      console.error(props.error)
      //avoid serializing the whole error as it breaks SSR
      props.error = props.error.message
    }
    if (props.data) {
      props.loaded = true
    }
    return props
  })
}
