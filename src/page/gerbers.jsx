const React = require('react')
const zipPath = require('../zip-info.json')
const info = require('../info.json')
const semantic = require('semantic-ui-react')
const zipUrl = `https://kitspace.org/boards/${info.id}/${zipPath}`

let Gerbers = React.createClass({
  render() {
    return (
      <div className="gerbersContainer">
        <semantic.Menu compact borderless>
          <semantic.Menu.Item>
            <h4>Order PCBs:</h4>
          </semantic.Menu.Item>
          <semantic.Menu.Item>
            <a className="zipPath" href={zipPath}>
              <semantic.Icon name="download" />
              Download
            </a>
          </semantic.Menu.Item>
          <semantic.Menu.Item>
            <a href={`https://aisler.net/p/new?url=${zipUrl}&ref=kitspace`}>
              <img style={{minWidth: 100}} src="/images/aisler.png" />
            </a>
          </semantic.Menu.Item>
          <semantic.Menu.Item>
            <a
              href={
                'https://www.pcbway.com/orderonline.aspx' +
                `?url=${zipUrl}&from=kitspace`
              }
            >
              <img style={{minWidth: 100}} src="/images/pcbway.png" />
            </a>
          </semantic.Menu.Item>
        </semantic.Menu>
      </div>
    )
  }
})

module.exports = Gerbers
