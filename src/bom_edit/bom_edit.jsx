const React = require('react')
const Bom = require('./bom')


const BomEdit = React.createClass({
  render() {
    return <Bom tsv={this.props.tsv} parts={this.props.parts} />
  }
})

module.exports = BomEdit
