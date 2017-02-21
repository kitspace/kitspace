const redux     = require('redux')
const immutable = require('immutable')
const util      = require('./util')

const initial_state = immutable.Map({
  queries: immutable.List(),
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
  addResponses(state, responses) {
    return state.set('responses', state.get('responses').merge(responses))
  },
  removeResponses(state, references) {
    const responses = state.get('responses').filter((_, k) => {
      references.contains(k)
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
