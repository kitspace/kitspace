import {query, formatTypeNames} from '@kitspace/urql'

export default function fetchQuery(urqlClient, QUERY, vars) {
  const q = formatTypeNames(query(QUERY, vars))
  return urqlClient.executeQuery(q).then(props => {
    props.loaded = true
    return props
  })
}
