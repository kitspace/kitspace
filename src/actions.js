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

module.exports = {makeActions, actions, store}
