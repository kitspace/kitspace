const Redux     = require('redux')
const React     = require('react')
const {h}       = require('react-hyperscript-helpers')
const path      = require('path')
const immutable = require('immutable')
const {Router, Route, Link, hashHistory} = require('react-router')

const Step1 = require('./step1')
const Step2 = require('./step2')
const Step3 = require('./step3')
const Step4 = require('./step4')

const board_colors = require('./board_colors')

const initial_state = immutable.Map({
  board: immutable.Map({
    status    : 'not sent',
    color     : 'green',
    yaml      : null,
    url       : null,
    files     : null,
    svgs      : null,
    stackup   : null,
    message   : '',
    bom       : '',
    readme    : null,
  }),
})

function reducer(state = initial_state, action) {
  switch(action.type) {
    case 'setStep':
      return state.set('activeStep', action.value)
    case 'setUrlSent': {
      const board = initial_state.get('board').set('status', 'sent')
        .set('url', action.value)
      return state.set('board', board)
    }
    case 'setFileListing': {
      const board = state.get('board').set('status', 'replied')
        .set('files', action.value)
      return state.set('board', board)
    }
    case 'setSvgs': {
      const {svgs} = action.value
      const board = state.get('board').set('status', 'done')
        .set('svgs', svgs)
      return state.set('board', board)
    }
    case 'setColor': {
      const board = state.get('board').set('color', action.value)
      return state.set('board', board)
    }
    case 'setBom': {
      const board = state.get('board').set('bom', action.value)
      return state.set('board', board)
    }
    case 'setYaml': {
      const info = action.value
      let board = state.get('board').set('yaml', immutable.Map(info))
      if (info.color) {
        if (board_colors.indexOf(info.color) >= 0) {
          board = board.set('color', info.color)
        } else {
          //TODO: warning
        }
      }
      return state.set('board', board)
    }
    case 'setReadme': {
      const board = state.get('board').set('readme', action.value)
      return state.set('board', board)
    }
    case 'setSummary': {
      const yaml = state.get('board').get('yaml').set('summary', action.value)
      const board = state.get('board').set('yaml', yaml)
      return state.set('board', board)
    }
    case 'setBoardError': {
      const board = state.get('board').set('status', 'failed')
        .set('message', action.value)
      return state.set('board', board)
    }
  }
  return state
}

function setStep(step) {
   return () => {
     if (step === 1) {
       return hashHistory.push('/')
     }
     return hashHistory.push(`/${step}`)
   }
}

const SubmitRouter = React.createClass({
  store: Redux.createStore(reducer),
  getInitialState() {
    return this.store.getState().toJS()
  },
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/'
          component = {
            () => h(Step1, {
              setStep,
              dispatch: this.store.dispatch,
              board: this.state.board,
            })
          }
        />
        <Route path='/2'
          component = {
            () => h(Step2, {
              setStep,
              dispatch: this.store.dispatch,
              board: this.state.board,
            })
          }
        />
        <Route path='/3'
          component = {
            () => h(Step3, {
              setStep,
              dispatch: this.store.dispatch,
              board: this.state.board,
            })
          }
        />
        <Route path='/4'
          component = {
            () => h(Step4, {
              setStep,
              dispatch: this.store.dispatch,
              board: this.state.board,
            })
          }
        />
      </Router>
    )
  },
  componentDidMount() {
    this.store.subscribe(() => {
      const state = this.store.getState().toJS()
      this.setState(state)
    })
  }
})

module.exports = SubmitRouter
