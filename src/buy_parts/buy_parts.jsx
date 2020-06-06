const React = require('react')
const semantic = require('semantic-ui-react')
const oneClickBom = require('1-click-bom')
const ReactResponsive = require('react-responsive')
const browserVersion = require('browser-version')

const installExtension = require('../install_extension')

const Bom = require('./bom')
const InstallPrompt = require('./install_prompt')
const DirectStores = require('./direct_stores')

//for react-double-scrollbar in IE11
require('babel-polyfill')

const BuyParts = React.createClass({
  getInitialState() {
    return {
      collapsed: true,
      extensionWaiting: true,
      extensionPresence: 'unknown',
      buyParts: installExtension,
      buyMultiplier: 1,
      buyAddPercent: 0,
      adding: {}
    }
  },
  getMultiplier() {
    let multi = this.state.buyMultiplier
    if (isNaN(multi) || multi < 1) {
      multi = 1
    }
    let percent = this.state.buyAddPercent
    if (isNaN(percent) || percent < 1) {
      percent = 0
    }
    return multi + multi * (percent / 100)
  },
  componentDidMount() {
    //extension communication
    window.addEventListener(
      'message',
      event => {
        if (event.source != window) {
          return
        }
        if (event.data.from == 'extension') {
          this.setState({
            extensionWaiting: false,
            extensionPresence: 'present'
          })
          switch (event.data.message) {
            case 'register':
              this.setState({
                buyParts: retailer => {
                  window.postMessage(
                    {
                      from: 'page',
                      message: 'quickAddToCart',
                      value: {
                        retailer,
                        multiplier: this.getMultiplier()
                      }
                    },
                    '*'
                  )
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
      },
      false
    )
  },
  linesToTsv() {
    const mult = this.getMultiplier()
    const lines = this.props.lines.map(line => {
      return Object.assign({}, line, {
        quantity: Math.ceil(line.quantity * mult)
      })
    })
    return oneClickBom.writeTSV(lines)
  },
  render() {
    const lines = this.props.lines
    const nLinesToDisplay = this.props.nLinesToDisplay
    const retailer_list = oneClickBom.getRetailers()
    const mult = this.getMultiplier()
    const retailerButtons = retailer_list
      .map(name => {
        const [numberOfLines, numberOfParts] = lines.reduce(
          ([numberOfLines, numberOfParts], line) => {
            if (line.retailers[name]) {
              return [
                numberOfLines + 1,
                numberOfParts + Math.ceil(mult * line.quantity)
              ]
            }
            return [numberOfLines, numberOfParts]
          },
          [0, 0]
        )
        if (numberOfLines > 0) {
          return (
            <RetailerButton
              name={name}
              adding={this.state.adding[name]}
              extensionPresence={
                name === 'Digikey' ? false : this.state.extensionPresence
              }
              buyParts={this.state.buyParts.bind(null, name)}
              numberOfParts={numberOfParts}
              numberOfLines={numberOfLines}
              totalLines={lines.length}
              key={name}
            />
          )
        }
      })
      .filter(x => x != null)
    return (
      <div className="BuyParts">
        <semantic.Header textAlign="center" as="h3" attached="top">
          <i className="icon-basket-3" />
          Buy Parts
        </semantic.Header>
        <InstallPrompt
          extensionPresence={this.state.extensionPresence}
          bomInstallLink={installExtension}
        />
        <AdjustQuantity
          buyMultiplier={this.state.buyMultiplier}
          buyAddPercent={this.state.buyAddPercent}
          setBuyMultiplier={v => this.setState({buyMultiplier: v})}
          setBuyAddPercent={v => this.setState({buyAddPercent: v})}
        />
        <semantic.Segment className="buttonSegment" attached>
          {retailerButtons}
        </semantic.Segment>
        <Bom
          attached
          parts={this.props.parts}
          tsv={this.linesToTsv()}
          length={this.props.lines.length}
          collapsed={this.state.collapsed}
          setCollapsed={v => this.setState({collapsed: v})}
        />
        <DirectStores
          multiplier={this.getMultiplier()}
          items={this.props.lines}
        />
      </div>
    )
  }
})

function AdjustQuantity(props) {
  return (
    <semantic.Segment textAlign="center" attached className="AdjustQuantity">
      Adjust quantity:
      <semantic.Icon
        style={{
          margin: 5,
          marginTop: 0
        }}
        name="delete"
      />
      <semantic.Input
        type="number"
        size="mini"
        min={1}
        value={props.buyMultiplier}
        style={{width: 80}}
        error={isNaN(props.buyMultiplier) || props.buyMultiplier < 1}
        onBlur={e => {
          const v = props.buyMultiplier
          if (isNaN(v) || v < 1) {
            props.setBuyMultiplier(1)
          }
        }}
        onChange={e => {
          var v = parseFloat(e.target.value)
          props.setBuyMultiplier(v)
        }}
      />
      <semantic.Icon
        style={{
          margin: 10,
          marginTop: 0
        }}
        name="plus"
      />
      <semantic.Input
        type="number"
        min={0}
        step={10}
        value={props.buyAddPercent}
        size="mini"
        style={{width: 80}}
        error={isNaN(props.buyAddPercent) || props.buyAddPercent < 0}
        onBlur={e => {
          const v = props.buyAddPercent
          if (isNaN(v) || v < 0) {
            props.setBuyAddPercent(0)
          }
        }}
        onChange={e => {
          var v = parseFloat(e.target.value)
          props.setBuyAddPercent(v)
        }}
      />
      <span className="notSelectable" style={{marginLeft: 5}}>
        %
      </span>
    </semantic.Segment>
  )
}

function RetailerButton(props) {
  const r = props.name
  let onClick = props.buyParts
  //if the extension is not here fallback to direct submissions
  if (
    props.extensionPresence !== 'present' &&
    typeof document !== 'undefined'
  ) {
    onClick = () => {
      const form = document.getElementById(r + 'Form')
      if (form) {
        form.submit()
      } else {
        props.buyParts()
      }
    }
  }
  const color = props.numberOfLines === props.totalLines ? 'green' : 'pink'
  return (
    <semantic.Button
      onClick={onClick}
      loading={props.adding}
      color={color}
      content={
        <div className="buttonText">
          <StoreIcon retailer={r} />
          {r}
        </div>
      }
      label={{
        as: 'a',
        color,
        content: ` ${props.numberOfLines}/${props.totalLines} lines (${props.numberOfParts} parts)`
      }}
      labelPosition="right"
      className={'retailerButton ' + color}
    />
  )
}

function StoreIcon(props) {
  const imgHref = `/images/${props.retailer}${
    props.disabled ? '-grey' : ''
  }.ico`
  return (
    <img
      className="storeIcons"
      key={props.retailer}
      src={imgHref}
      alt={props.retailer}
    />
  )
}

module.exports = BuyParts
