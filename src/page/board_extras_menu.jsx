const React = require('react')
const {Button, Header} = require('semantic-ui-react')
const IBomIcon = require('./ibom_icon')
const TracespaceIcon = require('./tracespace_icon')

const info = require('../info.json')

function BoardExtrasMenu({zipUrl, hasInteractiveBom}) {
  const ibomUrl = `/interactive_bom?${info.id}`
  return (
    <div className="board-extras-menu">
      <Button
        basic
        as="a"
        href={`https://tracespace.io/view/?boardUrl=${zipUrl}`}
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Header as="h4">
            <TracespaceIcon />
            Inspect Gerbers
          </Header>
          <div>Tracespace View</div>
        </div>
      </Button>
      {hasInteractiveBom && (
        <Button basic as="a" href={ibomUrl}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Header as="h4">
              <IBomIcon />
              Assembly Guide
            </Header>
            <div>Interactive HTML BOM</div>
          </div>
        </Button>
      )}
    </div>
  )
}

module.exports = BoardExtrasMenu
