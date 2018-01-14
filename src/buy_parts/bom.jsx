const React = require('react')
const DoubleScrollbar = require('react-double-scrollbar')

const TsvTable = require('./tsv_table')

module.exports = props => {
  return (
    <DoubleScrollbar>
      <TsvTable parts={props.parts} tsv={props.tsv} />
    </DoubleScrollbar>
  )
}
