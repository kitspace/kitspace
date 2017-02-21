const redux     = require('redux')
const immutable = require('immutable')

const initial_state = immutable.Map({
  queries: immutable.List(),
  query_time: Date.now(),
  responses: immutable.List(),
})


const reducers = {
  addQuery(state, query) {
    const queries = state.get('queries')
    if (queries.size === 0) {
      state = state.set('query_time', Date.now())
    }
    return state.set('queries', queries.push(query))
  },
  clearQueries(state) {
    return state.set('queries', immutable.List())
  },
}


function mainReducer(state = initial_state, action) {
  return Object.keys(reducers).reduce((state, name) => {
    if (name === action.type) {
      return reducers[name](state, action.value)
    }
    return state
  }, state)
}
