const immutable      = require('immutable')
const reduxImmutable = require('redux-immutable')
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

const initial_state = immutable.Map({
  lines: immutable.OrderedMap(),
  view: immutable.Map({
    editable: false,
  }),
})

function linesReducer(lines = initial_state.get('lines'), action) {
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

function viewReducer(view = initial_state.get('view'), action) {
  switch(action.type) {
    case 'setEditable': {
      return view.set('editable', action.value)
    }
  }
  return view
}

const reducer = reduxImmutable.combineReducers({
  lines: linesReducer,
  view: viewReducer,
})

module.exports = {initial_state, linesReducer, reducer, viewReducer, emptyLine}
