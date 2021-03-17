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
    const trackClick = vendor => e => {
      window.plausible('Order PCBs', {
        props: {project: this.props.project, vendor}
      })
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
            <a
              rel="nofollow"
              href={aislerUrl}
              target="_blank"
              className="PcbMenu__link"
              onClick={trackClick('Aisler')}
              onAuxClick={trackClick('Aisler')}
            >
              <img src="/images/aisler.png" />
              <semantic.Flag name="de" />
            </a>

            <a
              rel="nofollow"
              href={pcbwayUrl}
              target="_blank"
              className="PcbMenu__link"
              onClick={trackClick('PCBWay')}
              onAuxClick={trackClick('PCBWay')}
            >
              <img src="/images/pcbway.png" />
              <semantic.Flag name="cn" />
            </a>

            <a
              rel="nofollow"
              href={jlcpcbUrl}
              target="_blank"
              className="PcbMenu__link"
              onClick={trackClick('JLCPCB')}
              onAuxClick={trackClick('JLCPCB')}
            >
              <img src="/images/jlcpcb.png" />
              <semantic.Flag name="cn" />
            </a>

            <a
              rel="nofollow"
              href={oshparkUrl}
              target="_blank"
              className="PcbMenu__link"
              onClick={trackClick('OSHPark')}
              onAuxClick={trackClick('OSHPark')}
            >
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
  }
})

module.exports = OrderPcbs
