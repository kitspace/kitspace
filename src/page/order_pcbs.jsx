const React = require('react')
const createClass = require('create-react-class')
const semantic = require('semantic-ui-react')

const mediaQueries = require('../media_queries')
const {zipPath, folder, width, height, layers} = require('../zip-info.json')

const zipUrl = `https://kitspace.org/${folder}/${zipPath}`
const aislerUrl = `https://aisler.net/p/new?url=${zipUrl}&ref=kitspace`
const pcbwayUrl = `https://www.pcbway.com/QuickOrderOnline.aspx?fileurl=${zipUrl}&from=kitspace`
const oshparkUrl = `https://oshpark.com/import?url=${zipUrl}`
const pcbShopperUrl = `https://pcbshopper.com/?Width=${width}&Height=${height}&Units=mm&Layers=${layers}&Quantity=1&GetPrices`
const jlcpcbUrl = `https://cart.jlcpcb.com/quote?fileurl=${zipUrl}&from=kitspace`

let OrderPcbs = createClass({
  render() {
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
            <a href={aislerUrl} className="PcbMenu__link">
              <img src="/images/aisler.png" />
              <semantic.Flag name="de" />
            </a>

            <a href={pcbwayUrl} className="PcbMenu__link">
              <img src="/images/pcbway.png" />
              <semantic.Flag name="cn" />
            </a>

            <a href={jlcpcbUrl} className="PcbMenu__link">
              <img src="/images/jlcpcb.png" />
              <semantic.Flag name="cn" />
            </a>

            <a href={oshparkUrl} className="PcbMenu__link">
              <img src="/images/oshpark.png" />
              <semantic.Flag name="us" />
            </a>
          </div>
        </div>

        <div className="PcbMenu__group PcbMenu__compare">
          <div className="PcbMenu__sub-title">
            <h4>Compare PCB Prices:</h4>
          </div>
          <div className="PcbMenu__links-container">
            <a href={pcbShopperUrl} className="PcbMenu__link">
              <img src="/images/pcbshopper.png" />
            </a>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = OrderPcbs
