'use strict'
const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {h, tbody, tr}  = require('react-hyperscript-helpers')
const semantic        = require('semantic-ui-react')
const redux           = require('redux')
const immutable       = require('immutable')

const initial_state = immutable.Map({
  activeCell: null,
})

function reducer(state = initial_state, action) {
  return state
}

const store = redux.createStore(reducer)

const MpnPopup = require('./mpn_popup')

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

const TsvTable = React.createClass({
  render() {
    const tsv = this.props.tsv
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
          return (<MpnPopup datasheet='test' trigger={cell} />)
        }
        else {
          return cell
        }
      }))
    }))
    const tableProps = {celled: true, unstackable: true, selectable: true}
    return h(semantic.Table, tableProps, [headingJSX, bodyJSX])
  }
})

const BOM = React.createClass({
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
          <TsvTable tsv={this.props.tsv} />
          </DoubleScrollbar>
          </div>
      </div>
    )
  }
})

module.exports = BOM
