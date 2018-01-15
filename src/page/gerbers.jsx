const React = require('react')
const zipPath = require('../zip-info.json')
const semantic = require('semantic-ui-react')

let Gerbers = React.createClass({
  render() {
    return (
      <semantic.Segment className="gerbersContainer">
        <semantic.Label color="green" ribbon="top">
          Order PCBs:
        </semantic.Label>
        <semantic.Button.Group>
          <semantic.Button basic>
            <a className="zipPath" href={zipPath}>
              <semantic.Icon name="download" />
              Download
            </a>
          </semantic.Button>
          <semantic.Button basic>
            <img src="/images/aisler.png" />
          </semantic.Button>
          <semantic.Button basic>
            <img src="/images/pcbway.png" />
          </semantic.Button>
        </semantic.Button.Group>
      </semantic.Segment>
    )
  }
})

module.exports = Gerbers
