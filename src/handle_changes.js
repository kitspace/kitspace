const redis = require('redis')
const immutable = require('immutable')
const {flatten, unflatten} = require('flat')

const octopart = require('./octopart')
const runRetailers = require('./retailers')

const {request_bus, response_bus} = require('./message_bus')

const QUERY_BATCH_SIZE = 20
const QUERY_MAX_WAIT_MS = 100 //milliseconds

//24hrs
const CACHE_TIMEOUT_MS = 24 * 60 * 60 * 1000 //milliseconds

const redisClient = redis.createClient()


setInterval(checkRequests, 1000)
request_bus.on('request', checkRequests)

let requests = immutable.List()
function checkRequests(r) {
  if (r) {
    requests = requests.push(r)
  }
  return resolveCached(requests).then(queries => {
    requests = queries
    const now = Date.now()
    const timed_out = requests.reduce((timed_out, query) => {
      return timed_out || ((now - query.get('time')) > QUERY_MAX_WAIT_MS)
    }, false)
    if ((requests.size >= QUERY_BATCH_SIZE) || timed_out) {
      requestNew(requests.slice(0, QUERY_BATCH_SIZE))
      requests = requests.slice(QUERY_BATCH_SIZE)
    }
  })
}

function resolveCached(queries) {
  const uncached = queries.map(q => (
    new Promise((resolve, reject) => {
      const key = queryToKey(q.get('query'))
      redisClient.get(key, (err, response) => {
        if (response) {
          response_bus.emit(q.getIn(['query', 'id']), fromRedis(response))
          return resolve(null)
        }
        return resolve(q)
      })
    })
  ))
  return Promise.all(uncached).then(qs => {
    qs = qs.filter(q => q)
    return immutable.List(qs)
  })
}

function requestNew(queries) {
  queries = queries.map(q => q.get('query'))
  console.log('requestNew', queries.toJS())
  octopart(queries).then(r => runRetailers(r)).then(results => {
    cache(results)
    results.forEach((v, k) => {
      response_bus.emit(k.get('id'), v)
    })
  }).catch(e => console.error(e))
}

function cache(responses) {
  responses.forEach((v, query) => {
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

module.exports = {}
