const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {h, tbody, tr}  = require('react-hyperscript-helpers')
const semantic        = require('semantic-ui-react')
const ramda           = require('ramda')
const oneClickBom     = require('1-click-bom')
const ReactResponsive = require('react-responsive')
const DirectStores    = require('../page/direct_stores')

const mediaQueries = require('../media_queries')
const installExtension = require('../install_extension')

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

const BomView = React.createClass({
  getInitialState() {
    return {
      collapsed         : true,
      extensionWaiting  : true,
      extensionPresence : 'unknown',
      buyParts          : installExtension,
      buyMultiplier     : 1,
      buyAddPercent     : 10,
      adding            : {},
    }
  },
  getMultiplier() {
    const multi = this.state.buyMultiplier
    const percent = this.state.buyAddPercent
    return multi + (multi * (percent / 100))
  },
  componentDidMount() {
    //extension communication
    window.addEventListener('message', event => {
      if (event.source != window) {
        return
      }
      if (event.data.from == 'extension'){
        this.setState({
          extensionWaiting: false,
          extensionPresence: 'present',
        })
        switch (event.data.message) {
          case 'register':
            this.setState({
              onClick: (retailer) => {
                window.postMessage({
                  from    : 'page',
                  message : 'quickAddToCart',
                  value: {
                    retailer,
                    multiplier: this.getMultiplier()
                  }}, '*')
              }
            })
            break
          case 'updateAddingState':
            this.setState({
              adding: event.data.value
            })
            break
        }
      }
    }, false)
    if (window != null){
      setTimeout(() => {
        this.setState({
          extensionPresence:
            !this.state.extensionWaiting ? 'present' : 'not_present'
        })
      }, 3000)
    }
  },
  render() {
    const lines = this.props.lines
    const numberOfEach = {}
    const retailers = {}
    const retailer_list = oneClickBom.lineData.retailer_list
    retailer_list.forEach(r => {
      retailers[r] = lines.map(l => l.retailers[r])
      numberOfEach[r] = retailers[r].filter(x => x !== '').length
    })
    const numberOfItems = lines.reduce((n, line) => n + line.quantity, 0)
    const header = r => {
      const n = numberOfEach[r]
      if (n === 0) {
        return null
      }
      let onClick = this.state.buyParts.bind(null, r)
      //if the extension is not here fallback to direct submissions
      if ((this.state.extensionPresence !== 'present')
        && (typeof document !== 'undefined')
        && document.getElementById(r + 'Form') !== null) {
        onClick = () => {
          document.getElementById(r + 'Form').submit()
        }
      }
      const total = retailers[r].length
      return (
        <semantic.Table.HeaderCell
          className='compact retailerHeader'
          error={n !== total}
          key={r}
          rowSpan={2}
          onClick={onClick}
        >
          <div className='headerCell'>
            <div className='headerCellText'>
              {r}
              <p style={{fontSize: 14, fontWeight: 'normal'}}>
                {`${n}/${total}`}
              </p>
            </div>
            <div className='headerCellIcon'>
              <i style={{fontSize: 22}} className='icon-basket-3' />
            </div>
          </div>
        </semantic.Table.HeaderCell>
      )
    }
    const headers = retailer_list.map(header).filter(x => x != null)
    return (
      <div className='bom'>
        <div className='bomTableContainer'>
          <ReactResponsive query={mediaQueries.mobile_m}>
            {matches => {
              return (
                <div>
                  <semantic.Table compact fixed celled unstackable={!matches}>
                    <semantic.Table.Header>
                      <semantic.Table.Row>
                        <semantic.Table.Cell>{`${lines.length} lines`}</semantic.Table.Cell>
                        {headers}
                      </semantic.Table.Row>
                      <semantic.Table.Row>
                        <semantic.Table.Cell>{`${numberOfItems} items`}</semantic.Table.Cell>
                      </semantic.Table.Row>
                    </semantic.Table.Header>
                    <semantic.Table.Body>
                      <semantic.Table.Row>
                        <semantic.Table.Cell
                          selectable
                          textAlign='center'
                          colSpan={headers.length + 1}
                        >
                          <a
                            style={{fontSize: 12, textDecoration: 'none'}}
                            onClick={() => this.setState({collapsed: !this.state.collapsed})}
                          >
                            {(() =>  {
                              if (this.state.collapsed) {
                                return 'View parts details'
                              } else {
                                return 'Hide parts details'
                              }
                            })()}
                          </a>
                        </semantic.Table.Cell>
                      </semantic.Table.Row>
                      {(() => {
                        if(!this.state.collapsed && !matches) {
                          return (
                            <semantic.Table.Row>
                              <semantic.Table.Cell colSpan={headers.length + 1}>
                                <DoubleScrollbar>
                                  <TsvTable parts={this.props.parts} tsv={this.props.tsv} />
                                </DoubleScrollbar>
                              </semantic.Table.Cell>
                            </semantic.Table.Row>
                          )
                        }
                      })()}
                    </semantic.Table.Body>
                  </semantic.Table>
                  {(() => {
                    if(!this.state.collapsed && matches) {
                      return (
                        <DoubleScrollbar>
                          <TsvTable parts={this.props.parts} tsv={this.props.tsv} />
                        </DoubleScrollbar>
                      )
                    }
                  })()}
                </div>
              )
            }}
          </ReactResponsive>
          <DirectStores
            multiplier={this.getMultiplier()}
            items={this.props.lines}
          />
        </div>
      </div>
    )
  }
})

module.exports = BomView
