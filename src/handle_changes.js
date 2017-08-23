const redis = require('redis')
const immutable = require('immutable')
const {flatten, unflatten} = require('flat')

const octopart = require('./octopart')
const farnell = require('./farnell')
const {actions, store} = require('./actions')

const QUERY_BATCH_SIZE = 20
const QUERY_MAX_WAIT_MS = 100 //milliseconds

//24hrs
const CACHE_TIMEOUT_MS = 24 * 60 * 60 * 1000 //milliseconds

const redisClient = redis.createClient()

function handleQueries(queries) {
  return resolveCached(queries).then(requestNew)
}

function resolveCached(queries) {
  const responses = queries.map(q => (
    new Promise((resolve, reject) => {
      const key = queryToKey(q.get('query'))
      redisClient.get(key, (err, response) => {
        resolve({query: q, response})
      })
    })
  ))
  return Promise.all(responses).then(rs => {
    const cached_responses = immutable.Map(rs.filter(q => q.response)
      .map(q => {
        console.log('retrieved', q.query.get('query').toJS())
        const res = fromRedis(q.response)
        return [q.query.get('query'), res]
      }))
    const cached_keys = cached_responses.keySeq()
    const cached_queries = queries.filter(q => cached_keys.includes(q.get('query')))
    actions.removeQueries(cached_queries)
    actions.addResponses(cached_responses)
    const uncached = rs.filter(q => !q.response).map(q => q.query)
    const uncached_queries = queries.filter(q => !cached_keys.includes(q.get('query')))
    return uncached_queries
  })
}

function requestNew(queries) {
  const now = Date.now()
  const timed_out = queries.reduce((timed_out, query) => {
    return timed_out || ((now - query.get('time')) > QUERY_MAX_WAIT_MS)
  }, false)
  if ((queries.size >= QUERY_BATCH_SIZE) || timed_out) {
    const batch = queries.take(QUERY_BATCH_SIZE)
    actions.removeQueries(batch)
    const qs = batch.map(q => q.get('query'))
    octopart(qs).then(farnell).then(results => {
      cache(results)
      actions.addResponses(results)
    }).catch(e => console.error(e))
  }
}

function cache(responses) {
  responses.forEach((v, query) => {
    console.log('caching', query.toJS())
    const key = queryToKey(query)
    const values = toRedis(v)
    redisClient.set(key, values)
  })
}

function toRedis(response) {
  return JSON.stringify(response.toJS())
}

function fromRedis(redis_response) {
  return immutable.fromJS(JSON.parse(redis_response))
}

function queryToKey(query) {
  return query.filter((_, k) => k !== 'id').hashCode()
}

module.exports = {handleQueries}
