const immutable = require('immutable')
const React     = require('react')
const redux     = require('redux')

function getId() {
  if (this.id == null) {
    this.id = 0
  }
  return id++
}

const emptyLine = immutable.fromJS({
  id         : getId(),
  references : '',
  quantity   : '',
  mpns       : [],
  Digikey    : '',
  Mouser     : '',
  RS         : ''
  Farnell    : '',
  Newark     : '',
})

const initial_state = immutable.fromJS({
  lines: [],
})

function reducer(state, action) {
  switch (action.type) {
    case 'addLine': {
      const lines = state.get('lines')
      return state.set('lines', lines.push(action.value))
    }
    case 'removeLine': {
      const lines = state.get('lines')
        .filter(x => x.get('id') !== action.value)
      return state.set('lines', lines)
    }
  }
  return state
}
