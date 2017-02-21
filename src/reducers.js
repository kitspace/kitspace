const redux     = require('redux')
const immutable = require('immutable')

const initial_state = immutable.Map({
  queries: immutable.List()
})


const reducers = {
  addQuery(state, query) {
    return state.set('queries', state.get('queries').push(query))
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
