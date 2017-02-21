const redux     = require('redux')
const immutable = require('immutable')

//24hrs
const TIMEOUT_MS = 24 * 60 * 60 * 1000 //milliseconds

const initial_state = immutable.Map({
  queries: immutable.List(),
  responses: immutable.List(),
})


const reducers = {
  addQuery(state, query) {
    const queries = state.get('queries')
    return state.set('queries', queries.push(query))
  },
  clearQueries(state, queriesToClear) {
    const queries = state.get('queries').filter(q => {
      return !queriesToClear.contains(q)
    })
    return state.set('queries', queries)
  },
  addResponse(state, response) {
    const responses = state.get('responses')
    return state.set('responses', responses.push(response))
  },
  clearTimedout(state) {
    const now = Date.now()
    const responses = state.get('responses').filter(r => {
      return (now - r.get('time')) < TIMEOUT_MS
    })
    return state.set('responses', responses)
  },
}


function mainReducer(state = initial_state, action) {
  return reducers[action.type](state, action.value)
}
