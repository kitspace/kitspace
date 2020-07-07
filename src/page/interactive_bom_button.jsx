const React = require('react')
const semantic = require('semantic-ui-react')

const info = require('../info.json')

function InteractiveBOMButton() {
  const ibomUrl = `/interactive_bom?${info.id}`
  return (
    <div className="InteractiveBOMButton">
      <semantic.Menu compact borderless>
        <div className="InteractiveBOMButton__container">
          <div className="InteractiveBOMButton__link">
            <semantic.Menu.Item as="a" href={ibomUrl}>
              <semantic.Icon size="big" name="microchip" />
              Assembly Assistant
            </semantic.Menu.Item>
          </div>
        </div>
      </semantic.Menu>
    </div>
  )
}

module.exports = InteractiveBOMButton
