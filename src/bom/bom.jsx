const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const semantic        = require('semantic-ui-react')
const oneClickBom     = require('1-click-bom')
const ReactResponsive = require('react-responsive')
const DirectStores    = require('../page/direct_stores')

const mediaQueries = require('../media_queries')
const installExtension = require('../install_extension')

const TsvTable = require('./tsv_table')


//for react-double-scrollbar in IE11
require('babel-polyfill')


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
              buyParts: (retailer) => {
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
  storeIcon(retailer, disabled=false) {
    const imgHref = `/images/${retailer}${disabled ? '-grey' : ''}.ico`
    return (
      <img
        className='storeIcons'
        key={retailer}
        src={imgHref}
        alt={retailer}
      />
    )
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
              <div className='headerCellName'>
                {this.storeIcon(r)}
                {r}
              </div>
              <p style={{fontSize: 14, fontWeight: 'normal'}}>
                {`${n}/${total}`}
              </p>
            </div>
            <div className='headerCellIcon'>
              {(() => {
                if (this.state.adding[r]) {
                  return <semantic.Loader active inline />
                }
                return <i style={{fontSize: 22}} className='icon-basket-3' />
              })()}
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
