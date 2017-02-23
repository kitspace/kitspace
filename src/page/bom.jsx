'use strict'
const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {h, table, thead, tbody, tr, th, td} = require('react-hyperscript-helpers')
const {Table} = require('semantic-ui-react')

//for react-double-scrollbar in IE11
require('babel-polyfill')

function markerColor(ref) {
  if (/^C\d/.test(ref)) {
    return 'orange'
  }
  if (/^R\d/.test(ref)) {
    return 'lightblue'
  }
  if (/^IC\d/.test(ref) || /^U\d/.test(ref)) {
    return 'blue'
  }
  if (/^L\d/.test(ref)) {
    return 'black'
  }
  if (/^D\d/.test(ref)) {
    return 'green'
  }
  if (/^LED\d/.test(ref)) {
    return 'yellow'
  }
  return 'purple'
}

function tsvToTable(tsv) {
  const lines = tsv.split('\n').slice(0, -1)
  const headings = lines[0].split('\t')
  let headingJSX = headings.map((text) => {
    return h(Table.HeaderCell, {selectable: true}, text)
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
      const className = columnIndex === 0 ? 'marked ' + markerColor(text) : ''
      return h(Table.Cell, {error, className}, text)
    }))
  }))
  const tableProps = {celled: true, unstackable: true, selectable: true}
  return h(Table, tableProps, [headingJSX, bodyJSX])
}

let BOM = React.createClass({
  propTypes: {
    tsv: React.PropTypes.string.isRequired
  },
  render: function () {
    if (this.props.tsv === '') {
      return <div></div>
    }
    return (
      <div className='bom'>
        <div className='bomTableContainer'>
          <DoubleScrollbar>
          {tsvToTable(this.props.tsv)}
          </DoubleScrollbar>
          </div>
      </div>
    )
  }
})

module.exports = BOM
