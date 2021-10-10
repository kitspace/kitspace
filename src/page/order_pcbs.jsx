const React = require('react')
const createClass = require('create-react-class')
const semantic = require('semantic-ui-react')

const mediaQueries = require('../media_queries')
const {zipPath, folder, width, height, layers} = require('../zip-info.json')

const zipUrl = `https://kitspace.org/${folder}/${zipPath}`

const urls = {
  aisler: `https://aisler.net/p/new?url=${zipUrl}&ref=kitspace`,
  pcbway: `https://www.pcbway.com/QuickOrderOnline.aspx?fileurl=${zipUrl}&from=kitspace`,
  oshpark: `https://oshpark.com/import?url=${zipUrl}`,
  jlcpcb: `https://cart.jlcpcb.com/quote?fileurl=${zipUrl}&from=kitspace`,
}

const niceNames = {
  aisler: 'Aisler',
  pcbway: 'PCBWay',
  oshpark: 'OSHPark',
  jlcpcb: 'JLCPCB',
}

const pcbShopperUrl = `https://pcbshopper.com/?Width=${width}&Height=${height}&Units=mm&Layers=${layers}&Quantity=1&GetPrices`

const defaultPcbServices = Object.keys(niceNames)

let OrderPcbs = createClass({
  render() {
    const trackClick = vendor => e => {
      window.plausible('Order PCBs', {
        props: {project: this.props.project, vendor: niceNames[vendor]},
      })
    }
    let pcbServices = this.props.pcbServices
    if (pcbServices === undefined) {
      pcbServices = defaultPcbServices
    } else if (pcbServices === null) {
      pcbServices = []
    }
    return (
      <div className="PcbMenu">
        <div className="PcbMenu__group PcbMenu__download">
          <a href={zipPath} className="PcbMenu__link">
            <semantic.Icon name="download" />
            Download Gerbers
          </a>
        </div>

        <div
          className="PcbMenu__group"
          style={{flexGrow: 1, justifyContent: 'space-around'}}
        >
          <div className="PcbMenu__sub-title">
            <h4>Order PCBs:</h4>
          </div>

          <div className="PcbMenu__links-container">
            {pcbServices.map(vendor => (
              <a
                rel="nofollow"
                href={urls[vendor]}
                target="_blank"
                className="PcbMenu__link"
                onClick={trackClick(vendor)}
                onAuxClick={trackClick(vendor)}
                key={vendor}
              >
                <img alt={`${vendor} logo`} src={`/images/${vendor}.png`} />
              </a>
            ))}
          </div>
        </div>

        <div className="PcbMenu__group PcbMenu__compare">
          <div className="PcbMenu__sub-title">
            <h4>Compare PCB Prices:</h4>
          </div>
          <div className="PcbMenu__links-container">
            <a
              rel="nofollow"
              href={pcbShopperUrl}
              target="_blank"
              className="PcbMenu__link"
              onClick={trackClick('PCBShopper')}
              onAuxClick={trackClick('PCBShopper')}
            >
              <img src="/images/pcbshopper.png" />
            </a>
          </div>
        </div>
      </div>
    )
  },
})

module.exports = OrderPcbs
