const redux = require('redux')

const {reducers, mainReducer} = require('./reducers')

//creates an actions object that dispatches with method names from `reducers`
function makeActions(store) {
    const actions = {}
    Object.keys(reducers).forEach(name => {
      actions[name] = function actionDispatch(value) {
        store.dispatch({type: name, value})
      }
    })
    return actions
}

const store = redux.createStore(mainReducer)
const actions = makeActions(store)

let prev_state = store.getState()
function changed(state, key) {
  const value = state.getIn(key)
  if (value == null) {
    return false
  }
  const ret = !value.equals(prev_state.getIn(key))
  prev_state = prev_state.setIn(key, value)
  return ret
}

store.subscribeChanges = function subscribeChanges(key, callback) {
  return store.subscribe(() => {
    const state = store.getState()
    if (changed(state, key)) {
      callback(state.getIn(key))
    }
  })
}

module.exports = {makeActions, actions, store}
