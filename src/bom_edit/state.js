const immutable = require('immutable')
const redux     = require('redux')

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
        partNumbers => partNumbers.add(partNumber)
      )
      return lines.set(id, line)
    }
    case 'removePartNumber': {
      const {id, partNumber} = action.value
      const line = lines.get(id).update(
        'partNumbers',
         partNumbers => partNumbers.filterNot(x => x.equals(partNumber))
      )
      return lines.set(id, line)
    }
    case 'sortByReference': {
      return lines.sortBy(line => line.get('reference'))
    }
  }
  return lines
}

const reducer = redux.combineReducers({
  lines: linesReducer,
})

const store = redux.createStore(reducer, initial_state)

module.exports = {initial_state, linesReducer, store, emptyLine}
