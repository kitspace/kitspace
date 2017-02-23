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
      activeCell: null,
      activePopup: null,
    }
  },
  componentWillMount() {
    this.setActiveCell = throttle((rowIndex, columnIndex) => {
      this.setState({activeCell: [rowIndex, columnIndex]})
    }, 300)
  },
  render() {
    const tsv = this.props.tsv
    const lines = tsv.split('\n').slice(0, -1)
    const headings = lines[0].split('\t')
    let headingJSX = headings.map((text) => {
      return h(semantic.Table.HeaderCell, text)
    })
    headingJSX = h(semantic.Table.Header, [h(semantic.Table.Row, headingJSX)])
    function markPink(index) {
      return ['Manufacturer', 'MPN', 'Description']
        .indexOf(headings[index]) < 0
    }
    const activeCell = this.state.activeCell
    const activePopup = this.state.activePopup
    const bodyJSX = tbody(lines.slice(1).map((line, rowIndex) => {
      const rowActiveCell = activeCell && activeCell[0] === rowIndex
      const rowActivePopup = activePopup && activePopup[0] === rowIndex
      const rowSelected = rowActivePopup || (!activePopup && rowActiveCell)
      line = line.split('\t')
      return h(semantic.Table.Row, {className: rowSelected ? 'selected' : ''}, line.map((text, columnIndex) => {
        const error       = markPink(columnIndex) && text == ''
        const className   = columnIndex === 0 ? 'marked ' + markerColor(text) : ''
        const cellActive  = rowActiveCell && activeCell[1] === columnIndex
        const popupActive = rowActivePopup && activePopup[1] === columnIndex
        const active      = popupActive || (!activePopup && cellActive)
        const setInactiveCell = () => {
          if (cellActive) {
            this.setState({activeCell: null})
          }
        }
        const setActivePopup = () => {
          this.setState({activePopup: [rowIndex, columnIndex]})
        }
        const setInactivePopup = () => {
          if (popupActive) {
            this.setState({activePopup: null})
          }
        }
        const cell = h(semantic.Table.Cell, {onMouseOver: this.setActiveCell.bind(this, rowIndex, columnIndex), error, className, active}, text)
        if (headings[columnIndex] === 'MPN') {
          return (<MpnPopup onOpen={setActivePopup} onClose={setInactivePopup} trigger={cell} />)
        }
        else {
          return cell
        }
      }))
    }))
    const tableProps = {celled: true, unstackable: true}
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
