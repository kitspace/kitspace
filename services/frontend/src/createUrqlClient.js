import {Client} from '@kitspace/urql'
import 'isomorphic-fetch'

function createUrqlClient({ssrMode, cookie}) {
  const headers = cookie ? {cookie} : {}
  return new Client({
    url: 'http://192.168.43.168:7334/!gitlabql',
    initialCache: ssrMode ? {} : window.__URQL_STORE__,
    fetchOptions: {
      credentials: 'include',
      headers,
    },
  })
}

export default createUrqlClient
