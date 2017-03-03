'use strict'
const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {h, tbody, tr}  = require('react-hyperscript-helpers')
const semantic        = require('semantic-ui-react')
const throttle        = require('lodash.throttle')

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
  render() {
    const tsv       = this.props.tsv
    const lines     = tsv.split('\n').slice(0, -1).map(line => line.split('\t'))
    const headings  = lines[0]
    const bodyLines = lines.slice(1)
    function markPink(columnIndex) {
      //mark pink empty cells in all columns except these three
      return ['Manufacturer', 'MPN', 'Description']
        .indexOf(headings[columnIndex]) < 0
    }
    let headingJSX = headings.map(text => {
      return h(semantic.Table.HeaderCell, text)
    })
    headingJSX = h(semantic.Table.Header, [h(semantic.Table.Row, headingJSX)])
    const activePopup = this.state.activePopup
    const bodyJSX = tbody(bodyLines.map((line, rowIndex) => {
      const rowActivePopup = activePopup && activePopup[0] === rowIndex
      const className      = rowActivePopup ? 'selected' : ''
      return h(semantic.Table.Row, {className}, line.map((text, columnIndex) => {
        const error     = markPink(columnIndex) && text === ''
        const className = columnIndex === 0 ? 'marked ' + markerColor(text) : ''
        const active    = rowActivePopup && activePopup[1] === columnIndex
        const setActivePopup = () => {
          this.setState({activePopup: [rowIndex, columnIndex]})
        }
        const setInactivePopup = () => {
          if (active) {
            this.setState({activePopup: null})
          }
        }
        const cell = h(semantic.Table.Cell, {
          error,
          className,
          active,
        }, text)
        const heading = headings[columnIndex]
        if (heading === 'MPN' || heading === 'Manufacturer') {
          let number
          if (heading === 'MPN') {
            number = text
          }
          else if (heading === 'Manufacturer') {
            number = bodyLines[rowIndex][columnIndex + 1]
          }
          const part = this.props.parts.reduce((prev, part) => {
            if (prev) {
              return prev
            }
            if (part && part.mpn && part.mpn.part === number) {
              return part
            }
          }, null) || {}
          return h(MpnPopup, {
            onOpen  : setActivePopup,
            onClose : setInactivePopup,
            trigger : cell,
            part    : part
          })
        }
        else {
          return cell
        }
      }))
    }))
    const tableProps = {
      selectable: !activePopup,
      celled: true,
      unstackable: true,
      onMouseOut: () => this.setState({activeCell: null})
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
