'use strict'
const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {h, tbody, tr}  = require('react-hyperscript-helpers')
const semantic        = require('semantic-ui-react')
const ramda           = require('ramda')

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
  getInitialState() {
    return {
      activePopup: null,
    }
  },
  mpnCells(contents, rowIndex, columnIndex) {
    const activePopup    = this.state.activePopup
    const rowActivePopup = activePopup && activePopup[0] === rowIndex
    const active         = rowActivePopup && activePopup[1] === columnIndex
    const setActivePopup = () => {
      this.setState({activePopup: [rowIndex, columnIndex]})
    }
    const setInactivePopup = () => {
      if (active) {
        this.setState({activePopup: null})
      }
    }
    const part = this.props.parts.reduce((prev, part) => {
      if (prev) {
        return prev
      }
      if (part && part.mpn && part.mpn.part === contents[1]) {
        return part
      }
    }, null) || {}
    const cells = []
    cells[0] = h(MpnPopup, {
      onOpen  : setActivePopup,
      onClose : setInactivePopup,
      trigger : h(semantic.Table.Cell, {active}, contents[0]),
      part    : part,
    })
    cells[1] = h(MpnPopup, {
      onOpen  : setActivePopup,
      onClose : setInactivePopup,
      trigger : h(semantic.Table.Cell, {active}, contents[1]),
      part    : part,
    })
    return cells
  },
  render() {
    const tsv       = this.props.tsv
    const lines     = tsv.split('\n').slice(0, -1).map(line => line.split('\t'))
    const headings  = lines[0]
    const bodyLines = lines.slice(1)
    let headingJSX = headings.map(text => {
      return h(semantic.Table.HeaderCell, text)
    })
    headingJSX = h(semantic.Table.Header, [h(semantic.Table.Row, headingJSX)])
    const bodyJSX = tbody(bodyLines.map((line, rowIndex) => {
      const grouped = line.reduce((grouped, text, columnIndex) => {
        const heading = headings[columnIndex]
        if (heading === 'Manufacturer') {
          grouped.push([text])
          return grouped
        }
        if (heading === 'MPN') {
          grouped[grouped.length - 1].push(text)
          return grouped
        }
        grouped.push(text)
        return grouped
      }, [])
      const groupedHeadings = headings.filter(h => h !== 'Manufacturer')
      function markPink(columnIndex) {
        //mark pink empty cells in all columns except these
        return ['Description']
          .indexOf(groupedHeadings[columnIndex]) < 0
      }
      const bodyCells = grouped.map((contents, columnIndex) => {
        if (typeof(contents) === 'object') {
          return this.mpnCells(contents, rowIndex, columnIndex)
        }
        const error     = markPink(columnIndex) && contents === ''
        const className = columnIndex === 0 ? 'marked ' + markerColor(contents) : ''
        const cell = h(semantic.Table.Cell, {
          error,
          className,
        }, contents)
        return cell
      })
      const activePopup    = this.state.activePopup
      const rowActivePopup = activePopup && activePopup[0] === rowIndex
      const className = rowActivePopup ? 'selected' : ''
      return h(semantic.Table.Row, {className}, ramda.flatten(bodyCells))
    }))
    const tableProps = {
      selectable  : !this.state.activePopup,
      celled      : true,
      unstackable : true,
    }
    return h(semantic.Table, tableProps, [headingJSX, bodyJSX])
  }
})

const BOM = React.createClass({
  propTypes: {
    tsv: React.PropTypes.string.isRequired,
    parts: React.PropTypes.array.isRequired,
  },
  render: function () {
    if (this.props.tsv === '') {
      return <div></div>
    }
    return (
      <div className='bom'>
        <div className='bomTableContainer'>
          <DoubleScrollbar>
          <TsvTable parts={this.props.parts} tsv={this.props.tsv} />
          </DoubleScrollbar>
          </div>
      </div>
    )
  }
})

module.exports = BOM
