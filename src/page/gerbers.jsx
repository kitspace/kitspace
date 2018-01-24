const React = require('react')
const semantic = require('semantic-ui-react')
const ReactResponsive = require('react-responsive')

const mediaQueries = require('../media_queries')
const {zipPath, folder, width, height} = require('../zip-info.json')

const zipUrl = `https://kitspace.org/${folder}/${zipPath}`

const aislerUrl = `https://aisler.net/p/new?url=${zipUrl}&ref=kitspace`
const pcbwayUrl =
  'https://www.pcbway.com/orderonline.aspx' +
  `?width=${width}&height=${height}&from=kitspace`

let Gerbers = React.createClass({
  render() {
    return (
      <ReactResponsive query={mediaQueries.mobile_m}>
        {matches => (
          <div className="gerbersContainer">
            <semantic.Menu compact stackable={matches} borderless>
              <semantic.Menu.Item>
                <h4>Order PCBs:</h4>
              </semantic.Menu.Item>
              <semantic.Menu.Item>
                <a href={zipPath}>
                  <semantic.Icon name="download" />
                  Download
                </a>
              </semantic.Menu.Item>
              <semantic.Menu.Item>
                <a href={aislerUrl}>
                  <img style={{minWidth: 100}} src="/images/aisler.png" />
                </a>
              </semantic.Menu.Item>
              <semantic.Menu.Item>
                <a href={pcbwayUrl} onClick={() => window.open(zipPath)}>
                  <img style={{minWidth: 100}} src="/images/pcbway.png" />
                </a>
              </semantic.Menu.Item>
            </semantic.Menu>
          </div>
        )}
      </ReactResponsive>
    )
  }
})

module.exports = Gerbers
