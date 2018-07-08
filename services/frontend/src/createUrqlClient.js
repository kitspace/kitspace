import {Client} from '@kitspace/urql'
import 'isomorphic-fetch'

function createUrqlClient({ssrMode}) {
  return new Client({
    url: 'http://192.168.43.168:7334/!gitlabql',
    initialCache: ssrMode ? {} : window.__URQL_STORE__,
    fetchOptions: {
      credentials: 'same-origin',
    },
  })
}

export default createUrqlClient
