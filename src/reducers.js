const redux     = require('redux')
const immutable = require('immutable')

const initial_state = immutable.Map({
  queries: immutable.List(),
  responses: immutable.List(),
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
    return state.set('responses', state.get('responses').concat(responses))
  },
  removeResponses(state, responsesToRemove) {
    const responses = state.get('responses').filter(q => {
      return !responsesToRemove.contains(q)
    })
    return state.set('responses', responses)
  },
}


function mainReducer(state = initial_state, action) {
  console.log(action)
  if (Object.keys(reducers).includes(action.type)) {
    return reducers[action.type](state, action.value)
  }
  return state
}

module.exports = {mainReducer, reducers}
