'use strict'
const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {h, tbody, tr}  = require('react-hyperscript-helpers')
const semantic        = require('semantic-ui-react')
const ramda           = require('ramda')
const oneClickBom     = require('1-click-bom')

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
    const activePopup = this.state.activePopup
    const active = activePopup
      && activePopup[0] === rowIndex
      && activePopup[1] === columnIndex
    const cells  = contents.map(t => h(semantic.Table.Cell, {active}, t))
    const number = contents[1]
    if (number !== '') {
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
        if (part && part.mpn && part.mpn.part === number) {
          return part
        }
      }, null) || {}
      return cells.map(cell => {
        return h(MpnPopup, {
          onOpen  : setActivePopup,
          onClose : setInactivePopup,
          trigger : cell,
          part    : part,
        })
      })
    }
    return cells
  },
  render() {
    const tsv       = this.props.tsv
    const lines     = tsv.split('\n').slice(0, -1).map(line => line.split('\t'))
    const headings  = lines[0]
    const bodyLines = lines.slice(1)
    let headingJSX  = headings.map(text => h(semantic.Table.HeaderCell, text))
    headingJSX      = h(semantic.Table.Header, [h(semantic.Table.Row, headingJSX)])
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

function RetailerHeader(props) {
}

const BomView = React.createClass({
  render() {
    const lines = this.props.lines
    const numberOfEach = {}
    const retailers = {}
    const retailer_list = oneClickBom.lineData.retailer_list
    retailer_list.forEach(r => {
      retailers[r] = lines.map(l => l.retailers[r])
      numberOfEach[r] = retailers[r].filter(x => x !== '').length
    })


    function header(r) {
      const n = numberOfEach[r]
      if (n === 0) {
        return null
      }
      const total = retailers[r].length
      return (
        <semantic.Table.HeaderCell error={n !== total} key={r}>
          <div style={{float: 'left'}}>
            {r}
            <p style={{fontSize: 14, fontWeight: 'normal'}}>
              {`${n}/${total}`}
            </p>
          </div>
          <div style={{float: 'right', margin: 10}}>
            <i style={{fontSize: 22}} className='icon-basket-3' />
          </div>
        </semantic.Table.HeaderCell>
      )
    }
    return (
      <div className='bom'>
        <div className='bomTableContainer'>
          <semantic.Table fixed celled unstackable>
            <semantic.Table.Header>
              <semantic.Table.Row>
                <semantic.Table.Cell>{`${lines.length} lines`}</semantic.Table.Cell>
                {retailer_list.map(header).filter(x => x)}
              </semantic.Table.Row>
            </semantic.Table.Header>
          </semantic.Table>
          <DoubleScrollbar>
            <TsvTable parts={this.props.parts} tsv={this.props.tsv} />
          </DoubleScrollbar>
        </div>
      </div>
    )
  }
})

module.exports = BomView
