const React = require('react')
const semantic = require('semantic-ui-react')

function TitleBar(props) {
  console.log({props})
  return (
    <div className="titleBar">
      <div className="logoContainer">
        <semantic.Menu inverted pointing secondary>
          <a href="/">
            <semantic.Image className="logoImg" src="/images/logo.svg" />
          </a>
          <semantic.Menu.Item
            active={
              props.route === '/' || RegExp('^/boards/').test(props.route)
            }
          >
            <a href="/">{'Projects'}</a>
          </semantic.Menu.Item>
          <semantic.Menu.Item>
            <a target="blank" href="https://1clickbom.com">
              {'1-click BOM'}
            </a>
          </semantic.Menu.Item>
          <semantic.Menu.Item>
            <a href="/bom-builder">{'BOM Builder'}</a>
          </semantic.Menu.Item>
        </semantic.Menu>
      </div>
    </div>
  )
}

module.exports = TitleBar
