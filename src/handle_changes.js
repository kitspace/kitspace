const octopart         = require('./octopart')
const {actions, store} = require('./actions')

const QUERY_BATCH_SIZE = 20
const QUERY_MAX_WAIT_MS = 100 //milliseconds

//24hrs
const CACHE_TIMEOUT_MS = 24 * 60 * 60 * 1000 //milliseconds


function handleQueries(queries) {
  const now = Date.now()
  const timed_out = queries.reduce((timed_out, query) => {
    return timed_out || ((now - query.get('time')) > QUERY_MAX_WAIT_MS)
  }, false)
  if ((queries.size >= QUERY_BATCH_SIZE) || timed_out) {
    const batch = queries.take(QUERY_BATCH_SIZE)
    actions.removeQueries(batch)
    const qs = batch.map(q => q.get('query'))
    octopart(qs).then(results => {
      actions.addResponses(results)
    }).catch(e => console.error(e))
  }
}

module.exports = {handleQueries}
