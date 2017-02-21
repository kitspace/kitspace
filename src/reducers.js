const redux     = require('redux')
const immutable = require('immutable')

//24hrs
const TIMEOUT_MS = 24 * 60 * 60 * 1000 //milliseconds

const initial_state = immutable.Map({
  queries: immutable.Map(),
  responses: immutable.Map(),
})


const reducers = {
  addQuery(state, query) {
    const queries = state.get('queries')
    return state.set('queries', queries.push(query))
  },
  removeQueries(state, queriesToRemove) {
    const queries = state.get('queries').filter(q => {
      return !queriesToRemove.contains(q)
    })
    return state.set('queries', queries)
  },
  addResponse(state, response) {
    const responses = state.get('responses')
    return state.set('responses', responses.push(response))
  },
  removeResponses(state, responsesToRemove) {
    const responses = state.get('responses').filter(q => {
      return !responsesToRemove.contains(q)
    })
    return state.set('responses', responses)
  },
}


function mainReducer(state = initial_state, action) {
  return reducers[action.type](state, action.value)
}
