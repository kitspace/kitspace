const redux     = require('redux')
const immutable = require('immutable')

const initial_state = immutable.Map({
  queries: immutable.List(),
  responses: immutable.Map(),
})


const reducers = {
  addQuery(state, query) {
    const queries = state.get('queries')
    return state.set('queries', queries.push(query))
  },
  removeQueries(state, queries_to_remove) {
    const queries = state.get('queries').filter(q => {
      return !queries_to_remove.contains(q)
    })
    return state.set('queries', queries)
  },
  addResponses(state, responses) {
    return state.set('responses', state.get('responses').merge(responses))
  },
  removeResponses(state, query_ids) {
    const responses = state.get('responses').filter((_, k) => {
      query_ids.includes(k)
    })
    return state.set('responses', responses)
  },
}


function mainReducer(state = initial_state, action) {
  if (Object.keys(reducers).includes(action.type)) {
    const state2 = reducers[action.type](state, action.value)
    return state2
  }
  return state
}

module.exports = {mainReducer, reducers}
