const immutable = require('immutable')
const redux     = require('redux')

function getId() {
  if (this.id == null) {
    this.id = 0
  }
  return id++
}

const emptyLine = immutable.Map({
  references : '',
  quantity   : '',
  mpns       : immutable.Set(),
  Digikey    : '',
  Mouser     : '',
  RS         : '',
  Farnell    : '',
  Newark     : '',
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
    case 'addMpn': {
      const {id, mpn} = action.value
      const line = lines.get(id).update('mpns', mpns => mpns.add(mpn))
      return lines.set(id, line)
    }
    case 'removeMpn': {
      const {id, mpn} = action.value
      const line =
        lines.get(id).update('mpns', mpns => mpns.filterNot(x => x.equals(mpn)))
      return lines.set(id, line)
    }
    case 'sortByReferences': {
      return lines.sortBy(line => line.get('references'))
    }
  }
  return lines
}

const reducer = redux.combineReducers({
  lines: linesReducer,
})

const store = redux.createStore(reducer, initial_state)

module.exports = {initial_state, linesReducer, store, emptyLine}
