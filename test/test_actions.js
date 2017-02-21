const redux  = require('redux')
const assert = require('assert')

const {store, actions} = require('../src/actions')


describe('actions', () => {
  it('dispatches', () => {
    const state1 = store.getState()
    assert(state1.get('queries').size === 0)
    actions.addQuery({mpn: 'NE555P'})
    const state2 = store.getState()
    assert(!state1.equals(state2))
    assert(state1.get('queries').size === 0)
    assert(state2.get('queries').size === 1)
  })
})
