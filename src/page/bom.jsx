'use strict'
const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {h, table, thead, tbody, tr, th, td} = require('react-hyperscript-helpers')
const {Table} = require('semantic-ui-react')

//for react-double-scrollbar in IE11
require('babel-polyfill')

function tsvToTable(tsv) {
  const lines = tsv.split('\n').slice(0, -1)
  const headings = lines[0].split('\t')
  let headingJSX = headings.map((text) => {
    return h(Table.HeaderCell, text)
  })
  headingJSX = h(Table.Header, [h(Table.Row, headingJSX)])
  const markPink = (index) => {
    return ['Manufacturer', 'MPN', 'Description']
      .indexOf(headings[index]) < 0
  }
  const bodyJSX = tbody(lines.slice(1).map((line, rowIndex) => {
    line = line.split('\t')
    return tr(`.tr${rowIndex % 2}`, line.map((text, columnIndex) => {
      const error = markPink(columnIndex) && text == ''
      return h(Table.Cell, {error}, text)
    }))
  }))
  const tableProps = {unstackable: true, singleline: true, selectable: true}
  return h(Table, tableProps, [headingJSX, bodyJSX])
}

let BOM = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  render: function () {
    return (
      <div className='bom'>
        <div className='bomTableContainer'>
          <DoubleScrollbar>
          {tsvToTable(this.props.data.tsv)}
          </DoubleScrollbar>
          </div>
      </div>
    )
  }
})

module.exports = BOM
