'use strict'
const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {h, table, thead, tbody, tr, th, td} = require('react-hyperscript-helpers')
const semantic = require('semantic-ui-react')

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
    return h(semantic.Table.HeaderCell, {selectable: true}, text)
  })
  headingJSX = h(semantic.Table.Header, [h(semantic.Table.Row, headingJSX)])
  function markPink(index) {
    return ['Manufacturer', 'MPN', 'Description']
      .indexOf(headings[index]) < 0
  }
  const bodyJSX = tbody(lines.slice(1).map((line, rowIndex) => {
    line = line.split('\t')
    return tr(`.tr${rowIndex % 2}`, line.map((text, columnIndex) => {
      const error = markPink(columnIndex) && text == ''
      const className = columnIndex === 0 ? 'marked ' + markerColor(text) : ''
      const cell = h(semantic.Table.Cell, {error, className, selectable:true}, text)
      if (headings[columnIndex] === 'MPN') {
        return (<semantic.Popup trigger={cell} position='bottom left' content='reaaaaaaaaaaaaaaaally long text and stuff, you could have an image here' />)
      }
      else {
        return cell
      }
    }))
  }))
  const tableProps = {celled: true, unstackable: true, selectable: true}
  return h(semantic.Table, tableProps, [headingJSX, bodyJSX])
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
