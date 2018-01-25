const React = require('react')
const semantic = require('semantic-ui-react')
const ReactResponsive = require('react-responsive')

const mediaQueries = require('../media_queries')
const {zipPath, folder, width, height} = require('../zip-info.json')

const zipUrl = `https://kitspace.org/${folder}/${zipPath}`

const aislerUrl = `https://aisler.net/p/new?url=${zipUrl}&ref=kitspace`
const pcbwayUrl =
  'https://www.pcbway.com/orderonline.aspx' +
  `?x=${width}&y=${height}&from=kitspace`

let OrderPcbs = React.createClass({
  render() {
    return (
      <ReactResponsive query={mediaQueries.mobile_m}>
        {matches => (
          <div className="OrderPcbs">
            <semantic.Menu stackable={matches} compact borderless>
              <semantic.Menu.Item>
                <h4>Order PCBs:</h4>
              </semantic.Menu.Item>
              <semantic.Menu.Item as="a" href={zipPath}>
                <semantic.Icon name="download" />
                Download
              </semantic.Menu.Item>
              <semantic.Menu.Item as="a" href={aislerUrl}>
                <img src="/images/aisler.png" />
              </semantic.Menu.Item>
              <semantic.Menu.Item
                as="a"
                href={pcbwayUrl}
                onClick={() => window.open(zipPath)}
              >
                <img src="/images/pcbway.png" />
              </semantic.Menu.Item>
            </semantic.Menu>
          </div>
        )}
      </ReactResponsive>
    )
  }
})

module.exports = OrderPcbs
