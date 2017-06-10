const React     = require('react')
const redux     = require('redux')
const semantic  = require('semantic-ui-react')
const BomView   = require('./bom_view')
const {reducer} = require('./state')

function BomEditor(props) {
  return <div />
}

const BomEdit = React.createClass({
  store: redux.createStore(reducer),
  toggleEdit() {
    this.store.dispatch({
      type  : 'setEditable',
      value : !this.state.view.editable
    })
  },
  getInitialState() {
    this.store.dispatch({type: 'setFromTsv', value: this.props.tsv})
    return this.store.getState().toJS()
  },
  render() {
    if (this.state.view.editable) {
      var bom = <BomEditor lines={this.state.lines} />
    }
    else {
      var bom = <BomView lines={this.state.lines} view={this.state.view} tsv={this.props.tsv} parts={this.props.parts} />
    }
    return (
      <div>
        <semantic.Button onClick={this.toggleEdit}>Edit</semantic.Button>
        {bom}
      </div>
    )
  },
  componentDidMount() {
    this.store.subscribe(() => {
      const state = this.store.getState().toJS()
      this.setState(state)
    })
  },
})

module.exports = BomEdit
