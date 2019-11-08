const React = require('react')
const semantic = require('semantic-ui-react')
const ReactResponsive = require('react-responsive')

const mediaQueries = require('../media_queries')
const {zipPath, folder, width, height, layers} = require('../zip-info.json')

const zipUrl = `https://kitspace.org/${folder}/${zipPath}`
const aislerUrl = `https://aisler.net/p/new?url=${zipUrl}&ref=kitspace`
const pcbwayUrl = `https://www.pcbway.com/QuickOrderOnline.aspx?fileurl=${zipUrl}&from=kitspace`
const royalCircuitsUrl = 'https://www.royalcircuits.com/'
const oshparkUrl = `https://oshpark.com/import?url=${zipUrl}`
const pcbShopperUrl = `https://pcbshopper.com/?Width=${width}&Height=${height}&Units=mm&Layers=${layers}&Quantity=1&GetPrices`

let OrderPcbs = React.createClass({
  render() {
    return (
      <ReactResponsive query={'(max-width: 710px)'}>
        {matches => (
          <div className="PcbMenu">
            <semantic.Menu stackable={matches} compact borderless>
              <div className="PcbMenu__container">
                <div className="PcbMenu__group PcbMenu__download">
                  <semantic.Menu.Item as="a" href={zipPath}>
                    <semantic.Icon size="big" name="download" />
                    Download Gerber Files
                  </semantic.Menu.Item>
                </div>

                <div className="PcbMenu__group">
                  <div className="PcbMenu__sub-title">
                    <semantic.Menu.Item>
                      <h4>Order PCBs:</h4>
                    </semantic.Menu.Item>
                  </div>

                  <div className="PcbMenu__links-container">
                    <semantic.Menu.Item
                      as="a"
                      href={aislerUrl}
                      className="PcbMenu__link"
                    >
                      <img src="/images/aisler.png" />
                      <semantic.Label floating={!matches}>
                        <semantic.Flag name="de" />
                      </semantic.Label>
                    </semantic.Menu.Item>

                    <semantic.Menu.Item
                      as="a"
                      href={pcbwayUrl}
                      className="PcbMenu__link"
                    >
                      <img src="/images/pcbway.png" />
                      <semantic.Label floating={!matches}>
                        <semantic.Flag name="cn" />
                      </semantic.Label>
                    </semantic.Menu.Item>

                    <semantic.Menu.Item
                      as="a"
                      href={royalCircuitsUrl}
                      className="PcbMenu__link"
                    >
                      <img src="/images/royal_circuits.png" />
                      <semantic.Label floating={!matches}>
                        <semantic.Flag name="us" />
                      </semantic.Label>
                    </semantic.Menu.Item>

                    <semantic.Menu.Item
                      as="a"
                      href={oshparkUrl}
                      className="PcbMenu__link"
                    >
                      <img src="/images/oshpark.png" />
                      <semantic.Label floating={!matches}>
                        <semantic.Flag name="us" />
                      </semantic.Label>
                    </semantic.Menu.Item>
                  </div>
                </div>

                <div className="PcbMenu__group PcbMenu__compare">
                  <div className="PcbMenu__sub-title">
                    <semantic.Menu.Item>
                      <h4>Compare PCB Prices:</h4>
                    </semantic.Menu.Item>
                  </div>
                  <div className="PcbMenu__links-container">
                    <semantic.Menu.Item as="a" href={pcbShopperUrl}>
                      <img src="/images/pcbshopper.png" />
                      <semantic.Label floating={!matches} />
                    </semantic.Menu.Item>
                  </div>
                </div>
              </div>
            </semantic.Menu>
          </div>
        )}
      </ReactResponsive>
    )
  }
})

module.exports = OrderPcbs
