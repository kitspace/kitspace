import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import fetch from 'isomorphic-fetch'

function createApolloClient({ssrMode, cookie}) {
  const headers = cookie ? {cookie} : {}
  return new ApolloClient({
    ssrMode,
    link: createHttpLink({
      uri: 'http://192.168.43.168:7334/!gitlabql',
      credentials: 'same-origin',
      fetch,
      headers,
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
    cache: ssrMode
      ? new InMemoryCache()
      : new InMemoryCache().restore(window.__APOLLO_STATE__),
  })
}

export default createApolloClient
