const React = require('react')
const redux = require('redux')
const Bom   = require('./bom')
const {reducer, initial_state} = require('./state')

function BomEditor(props) {
  return <div />
}

const BomEdit = React.createClass({
  store: redux.createStore(reducer, initial_state),
  getInitialState() {
    this.store.dispatch({type: 'setFromTsv', value: this.props.tsv})
    return this.store.getState().toJS()
  },
  componentDidMount() {
    this.store.subscribe(() => {
      const state = this.store.getState().toJS()
      this.setState(state)
    })
  },
  render() {
    if (this.state.view.editable) {
      return <BomEditor lines={this.state.lines} />
    }
    return <Bom tsv={this.props.tsv} parts={this.props.parts} />
  },
})

module.exports = BomEdit
