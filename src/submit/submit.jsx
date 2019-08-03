const Redux = require('redux')
const React = require('react')
const {h} = require('react-hyperscript-helpers')
const path = require('path')
const immutable = require('immutable')
const {Router, Route, Link, hashHistory} = require('react-router')

const TitleBar = require('../title_bar')
const PreviewGerbers = require('./preview_gerbers')
const PreviewBom = require('./preview_bom')
const PreviewReadme = require('./preview_readme')
const Finish = require('./finish')

const board_colors = require('./board_colors')

const initial_state = immutable.Map({
  board: immutable.fromJS({
    status: 'not sent',
    message: '',
    color: 'green',
    yaml: null,
    url: null,
    files: null,
    svgs: null,
    stackup: null,
    parts: [],
    gerbers: {
      errors: [],
      warnings: []
    },
    bom: {
      tsv: '',
      errors: [],
      warnings: []
    },
    readme: {
      rendered: null,
      errors: [],
      warnings: []
    }
  })
})

function reducer(state = initial_state, action) {
  switch (action.type) {
    case 'setStep':
      return state.set('activeStep', action.value)
    case 'setUrlSent': {
      const board = initial_state
        .get('board')
        .set('status', 'sent')
        .set('url', action.value)
      return state.set('board', board)
    }
    case 'setFileListing': {
      const board = state
        .get('board')
        .set('status', 'replied')
        .set('files', action.value)
      return state.set('board', board)
    }
    case 'setSvgs': {
      const {svgs} = action.value
      const board = state
        .get('board')
        .set('status', 'done')
        .set('svgs', svgs)
      return state.set('board', board)
    }
    case 'setColor': {
      const board = state.get('board').set('color', action.value)
      return state.set('board', board)
    }
    case 'setBom': {
      const board = state.get('board').setIn(['bom', 'tsv'], action.value)
      return state.set('board', board)
    }
    case 'setParts': {
      const board = state
        .get('board')
        .set('parts', immutable.List(action.value))
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
      const board = state
        .get('board')
        .setIn(['readme', 'rendered'], action.value)
      return state.set('board', board)
    }
    case 'setSummary': {
      const yaml = state
        .get('board')
        .get('yaml')
        .set('summary', action.value)
      const board = state.get('board').set('yaml', yaml)
      return state.set('board', board)
    }
    case 'reportNetworkError': {
      const board = state
        .get('board')
        .set('status', 'failed')
        .set('message', action.value)
      return state.set('board', board)
    }
    case 'reportError': {
      const {type, message} = action.value
      const board = state
        .get('board')
        .updateIn([type, 'errors'], es => es.push(message))
      return state.set('board', board)
    }
    case 'reportWarning': {
      const {type, message} = action.value
      const board = state
        .get('board')
        .updateIn([type, 'warnings'], ws => ws.push(message))
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
      <div>
        <TitleBar route="/submit/" />
        <Router history={hashHistory}>
          <Route
            path="/"
            component={() =>
              h(PreviewGerbers, {
                setStep,
                dispatch: this.store.dispatch,
                board: this.state.board
              })
            }
          />
          <Route
            path="/2"
            component={() =>
              h(PreviewBom, {
                setStep,
                dispatch: this.store.dispatch,
                board: this.state.board
              })
            }
          />
          <Route
            path="/3"
            component={() =>
              h(PreviewReadme, {
                setStep,
                dispatch: this.store.dispatch,
                board: this.state.board
              })
            }
          />
          <Route
            path="/4"
            component={() =>
              h(Finish, {
                setStep,
                dispatch: this.store.dispatch,
                board: this.state.board
              })
            }
          />
        </Router>
      </div>
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
