const assert    = require('better-assert')
const immutable = require('immutable')
const {initial_state, linesReducer, emptyLine} = require('../src/bom_edit/state')


describe('bom_edit lines actions', () => {
  describe('lines', () => {
    it('adds a line', done => {
      const lines1 = initial_state.lines
      assert(lines1.size === 0)
      const lines2 = linesReducer(lines1, {type: 'addLine', value: emptyLine})
      assert(lines1.size === 0)
      assert(lines2.size === 1)
      return done()
    })
    it('removes a line', done => {
      const lines1 = initial_state.lines
      assert(lines1.size === 0)
      const lines2 = linesReducer(lines1, {type: 'addLine', value: emptyLine})
      assert(lines1.size === 0)
      assert(lines2.size === 1)
      const id = lines2.keys().next().value
      const lines3 = linesReducer(lines2, {type: 'removeLine', value: id})
      assert(lines1.size === 0)
      assert(lines2.size === 1)
      assert(lines3.size === 0)
      return done()
    })
  })
  describe('mpns', () => {
    const lines1 = initial_state.lines
    const mpn = immutable.List.of('TI', 'NE555P')
    let lines2, id
    beforeEach(done => {
      lines2 = linesReducer(lines1, {type: 'addLine', value: emptyLine})
      assert(lines2.first().get('mpns').size === 0)
      id = lines2.keys().next().value
      return done()
    })
    it('adds an mpn', done => {
      const lines3 = linesReducer(
        lines2,
        {
          type: 'addMpn',
          value: {id, mpn}
        }
      )
      assert(lines3.first().get('mpns').size === 1)
      return done()
    })
    it('removes an mpn', done => {
      const lines3 = linesReducer(
        lines2,
        {type: 'addMpn', value: {id, mpn}}
      )
      assert(lines3.first().get('mpns').size === 1)
      const lines4 = linesReducer(
        lines3,
        {type: 'removeMpn', value: {id, mpn}}
      )
      assert(lines4.first().get('mpns').size === 0)
      return done()
    })
  })
  describe('sorting', () => {
    const lines1 = initial_state.lines
    let lines2
    beforeEach('set order', done => {
      lines2 = linesReducer(
        lines2,
        {type: 'addLine', value: emptyLine.set('references', 'C')}
      )
      lines2 = linesReducer(
        lines2,
        {type: 'addLine', value: emptyLine.set('references', 'B')}
      )
      lines2 = linesReducer(
        lines2,
        {type: 'addLine', value: emptyLine.set('references', 'A')}
      )
      assert(lines2.size === 3)
      const order = lines2.toList().map(x => x.get('references'))
      assert(order.equals(immutable.List.of('C', 'B', 'A')))
      return done()
    })
    it('sorts by references', done => {
      const lines3 = linesReducer(lines2, {type: 'sortByReferences'})
      const order = lines3.toList().map(x => x.get('references'))
      assert(order.equals(immutable.List.of('A', 'B', 'C')))
      return done()
    })
  })
})
