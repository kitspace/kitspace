const assert = require('better-assert')
const {initial_state, linesReducer, emptyLine} = require('../src/bom_edit/state')


describe('bom edit lines actions', () => {
  it('adds a line', done => {
    const lines1 = initial_state.lines
    assert(lines1.size === 0)
    const lines2 = linesReducer(lines1, {type: 'addLine', value: emptyLine})
    assert(lines1.size === 0)
    assert(lines2.size === 1)
    return done()
  })
})
