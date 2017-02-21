const octopart         = require('./octopart')
const {actions, store} = require('./actions')

const QUERY_BATCH_SIZE = 20
const QUERY_MAX_WAIT_MS = 3000 //milliseconds

//24hrs
const CACHE_TIMEOUT_MS = 24 * 60 * 60 * 1000 //milliseconds

let prev_state = store.getState()
store.subscribe(handleChanges)

function changed(state, key) {
  return !state.get(key).equals(prev_state.get(key))
}

function handleChanges() {
    const state = store.getState()
    if (! state.equals(prev_state)) {
      if (changed(state, 'queries')) {
        handleQueries(state.get('queries'))
      }
      prev_state = state
    }
}

function handleQueries(queries) {
  const now = Date.now()
  const timed_out = queries.reduce((timed_out, query) => {
    return timed_out || ((now - query.time) > QUERY_MAX_WAIT_MS)
  }, false)
  if ((query.size >= QUERY_BATCH_SIZE) || timed_out) {
    const batch = queries.take(QUERY_BATCH_SIZE)
    actions.removeQueries(batch)
    octopart(batch).then(results => {
      console.log(results)
    })
  }
}
