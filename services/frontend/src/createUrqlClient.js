import {Client} from 'urquelle'
import 'isomorphic-fetch'

function createUrqlClient({ssrMode, cookie}) {
  const headers = cookie ? {cookie} : {}
  return new Client({
    url: `${process.env.KITSPACE_DOMAIN}:${process.env.KITSPACE_PORT}/!gitlabql`,
    initialCache: ssrMode ? {} : window.__URQL_STORE__,
    fetchOptions: {
      credentials: 'include',
      headers,
    },
  })
}

export default createUrqlClient
