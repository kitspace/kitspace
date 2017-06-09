const assert    = require('better-assert')
const immutable = require('immutable')
const {initial_state, linesReducer, emptyLine} = require('../src/bom_edit/state')


describe('bom_edit lines actions', () => {
  describe('lines', () => {
    it('adds a line', () => {
      const lines1 = initial_state.get('lines')
      assert(lines1.size === 0)
      const lines2 = linesReducer(lines1, {type: 'addLine', value: emptyLine})
      assert(lines1.size === 0)
      assert(lines2.size === 1)
    })
    it('removes a line', () => {
      const lines1 = initial_state.get('lines')
      assert(lines1.size === 0)
      const lines2 = linesReducer(lines1, {type: 'addLine', value: emptyLine})
      assert(lines1.size === 0)
      assert(lines2.size === 1)
      const id = lines2.keys().next().value
      const lines3 = linesReducer(lines2, {type: 'removeLine', value: id})
      assert(lines1.size === 0)
      assert(lines2.size === 1)
      assert(lines3.size === 0)
    })
  })
  describe('partNumbers and SKUs', () => {
    const lines1 = initial_state.get('lines')
    const partNumber = immutable.Map({
      part         : 'NE555P',
      manufacturer : 'Texas Instruments'
    })
    let lines2, id
    beforeEach(() => {
      lines2 = linesReducer(lines1, {type: 'addLine', value: emptyLine})
      assert(lines2.first().get('partNumbers').size === 0)
      id = lines2.keys().next().value
    })
    it('adds a partNumber', () => {
      const lines3 = linesReducer(
        lines2,
        {type: 'addPartNumber', value: {id, partNumber}}
      )
      assert(lines3.first().get('partNumbers').size === 1)
    })
    it('removes a partNumber', () => {
      const lines3 = linesReducer(
        lines2,
        {type: 'addPartNumber', value: {id, partNumber}}
      )
      assert(lines3.first().get('partNumbers').size === 1)
      const lines4 = linesReducer(
        lines3,
        {type: 'removePartNumber', value: {id, partNumber}}
      )
      assert(lines4.first().get('partNumbers').size === 0)
    })
    it('sets SKUs', () => {
      const sku = immutable.Map({
        part   : '2303550',
        vendor : 'Farnell'
      })
      const lines3 = linesReducer(
        lines2,
        {type: 'addSku', value: {id, sku}}
      )
      const part = lines3.first().get('retailers').get('Farnell')
      assert(part === sku.get('part'))
    })
    it('overwrites SKUs', () => {
      const sku1 = immutable.Map({
        part   : '2303550',
        vendor : 'Farnell'
      })
      const sku2 = immutable.Map({
        part   : '',
        vendor : 'Farnell'
      })
      const lines3 = linesReducer(
        lines2,
        {type: 'addSku', value: {id, sku: sku1}},
      )
      const lines4 = linesReducer(
        lines3,
        {type: 'addSku', value: {id, sku: sku2}},
      )
      const part = lines4.first().get('retailers').get('Farnell')
      assert(part === sku2.get('part'))
    })
  })
  describe('TSV', () => {
    it('lets you set from TSV', () => {
      const tsv = 'References\tQty\tDigikey\ntest\t1\t8-98-989'
      const lines = linesReducer(
        initial_state.get('lines'),
        {type: 'setFromTsv', value: tsv}
      )
      const line      = lines.first()
      const quantity  = line.get('quantity')
      const reference = line.get('reference')
      const digikey   = line.get('retailers').get('Digikey')
      assert(quantity  === 1)
      assert(reference === 'test')
      assert(digikey   === '8-98-989')
    })
  })
  describe('sorting', () => {
    const lines1 = initial_state.get('lines')
    let lines2
    beforeEach('set order', () => {
      lines2 = linesReducer(
        lines2,
        {type: 'addLine', value: emptyLine.set('reference', 'C')}
      )
      lines2 = linesReducer(
        lines2,
        {type: 'addLine', value: emptyLine.set('reference', 'B')}
      )
      lines2 = linesReducer(
        lines2,
        {type: 'addLine', value: emptyLine.set('reference', 'A')}
      )
      assert(lines2.size === 3)
      const order = lines2.toList().map(x => x.get('reference'))
      assert(order.equals(immutable.List.of('C', 'B', 'A')))
    })
    it('sorts by reference', () => {
      const lines3 = linesReducer(lines2, {type: 'sortByReference'})
      const order = lines3.toList().map(x => x.get('reference'))
      assert(order.equals(immutable.List.of('A', 'B', 'C')))
    })
  })
})
