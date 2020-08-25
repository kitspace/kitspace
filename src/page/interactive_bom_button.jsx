const React = require('react')
const {Button, Header} = require('semantic-ui-react')
const IBomIcon = require('./ibom_icon')

const info = require('../info.json')

function InteractiveBOMButton() {
  const ibomUrl = `/interactive_bom?${info.id}`
  return (
    <Button basic as="a" href={ibomUrl}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Header as="h4">
          <IBomIcon />
          Assembly Guide
        </Header>
        <div>Interactive HTML BOM</div>
      </div>
    </Button>
  )
}

module.exports = InteractiveBOMButton
