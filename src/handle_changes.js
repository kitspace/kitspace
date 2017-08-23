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
      redisClient.hgetall(key, (err, response) => {
        console.log('retrieved', key, response)
        resolve({query: q.get('query'), response})
      })
    })
  ))
  return Promise.all(responses).then(rs => {
    const cached_respones = immutable.Map(rs.filter(q => q.response)
      .map(q => [q.query, fromRedis(q.response)]))
    actions.addResponses(cached_respones)
    const uncached_queries = rs.filter(q => !q.response).map(q => q.query)
    return immutable.List(uncached_queries)
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
    const key = queryToKey(query)
    const values = toRedis(v)
    console.log('caching', key, values)
    redisClient.hmset(key, values)
  })
}

function toRedis(response) {
  return flatten(response.toJS())
}

function fromRedis(redis_response) {
  return immutable.fromJS(unflatten(redis_response))
}

function queryToKey(query) {
  return query.hashCode()
}

module.exports = {handleQueries}
