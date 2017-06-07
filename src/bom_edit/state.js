const immutable   = require('immutable')
const redux       = require('redux')
const oneClickBom = require('1-click-bom')

function getId() {
  if (this.id == null) {
    this.id = 0
  }
  return id++
}

const emptyLine = immutable.Map({
  reference   : '',
  quantity    : '',
  partNumbers : immutable.Set(),
  retailers: immutable.Map({
    Digikey : '',
    Mouser  : '',
    RS      : '',
    Farnell : '',
    Newark  : '',
  }),
})

const initial_state = {
  lines: immutable.OrderedMap(),
}

function linesReducer(lines = initial_state.lines, action) {
  switch (action.type) {
    case 'addLine': {
      return lines.set(getId(), action.value)
    }
    case 'removeLine': {
      return lines.filter((_,key) => key !== action.value)
    }
    case 'addPartNumber': {
      const {id, partNumber} = action.value
      const line = lines.get(id).update(
        'partNumbers',
        ps => ps.add(partNumber)
      )
      return lines.set(id, line)
    }
    case 'addSku': {
      const {id, sku} = action.value
      const line = lines.get(id).setIn(
        ['retailers', sku.get('vendor')],
        sku.get('part')
      )
      return lines.set(id, line)
    }
    case 'removePartNumber': {
      const {id, partNumber} = action.value
      const line = lines.get(id).update(
        'partNumbers',
         ps => ps.filterNot(p => p.equals(partNumber))
      )
      return lines.set(id, line)
    }
    case 'sortByReference': {
      return lines.sortBy(line => line.get('reference'))
    }
    case 'setFromTsv': {
      const {lines} = oneClickBom.parseTSV(action.value)
      return immutable.fromJS(lines).map(line => {
        return line.update('partNumbers', ps => ps.toSet())
      })
    }
  }
  return lines
}

const reducer = redux.combineReducers({
  lines: linesReducer,
})

const store = redux.createStore(reducer, initial_state)

module.exports = {initial_state, linesReducer, store, emptyLine}
