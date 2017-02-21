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
  clearQueries(state) {
    return state.set('queries', immutable.List())
  },
}


function mainReducer(state = initial_state, action) {
  return reducers[action.type](state, action.value)
}
