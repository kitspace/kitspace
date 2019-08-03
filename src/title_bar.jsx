const React = require('react')
const semantic = require('semantic-ui-react')
const ReactResponsive = require('react-responsive')

const mediaQueries = require('./media_queries')

function TitleBar(props) {
  const isProjectRoute =
    props.route === '/' || RegExp('^/boards/').test(props.route)
  const isSubmitRoute = RegExp('^/submit/').test(props.route)
  return (
    <ReactResponsive query={mediaQueries.mobile}>
      {matches => (
        <div className="titleBar">
          <div className="logoContainer">
            <semantic.Menu inverted pointing secondary stackable={matches}>
              <a href="/">
                <semantic.Image className="logoImg" src="/images/logo.svg" />
              </a>
              <semantic.Menu.Item
                as="a"
                href="/"
                active={isProjectRoute || isSubmitRoute}
              >
                {'Projects'}
              </semantic.Menu.Item>
              <semantic.Menu.Item
                as="a"
                href="/bom_builder"
                active={props.route === '/bom_builder'}
              >
                {'BOM Builder'}
              </semantic.Menu.Item>
              <semantic.Menu.Item
                as="a"
                target="blank"
                href="https://1clickbom.com"
              >
                {'1-click BOM'}
              </semantic.Menu.Item>
            </semantic.Menu>
          </div>
          <div className="rightButtonsContainer">
            <semantic.Menu
              className="socialMenu"
              inverted
              pointing
              secondary
              stackable={matches}
            >
              <semantic.Menu.Item
                as="a"
                href="https://riot.im/app/#/room/#kitspace:matrix.org"
              >
                <semantic.Icon name="chat" />
                <span className="socialText">Chat</span>
              </semantic.Menu.Item>
              <semantic.Menu.Item as="a" href="https://twitter.com/kitspaceorg">
                <semantic.Icon name="twitter" />
                <span className="socialText">Twitter</span>
              </semantic.Menu.Item>
              <semantic.Menu.Item as="a" href="https://github.com/kitspace">
                <semantic.Icon name="github" />
                <span className="socialText">GitHub</span>
              </semantic.Menu.Item>
              {isSubmitRoute ? null : (
                <semantic.Menu.Item>
                  <semantic.Button
                    icon
                    labelPosition={matches ? null : "left"}
                    color="green"
                    href="/submit"
                  >
                    <semantic.Icon name="plus" />
                    Add a project
                  </semantic.Button>
                </semantic.Menu.Item>
              )}
            </semantic.Menu>
          </div>
        </div>
      )}
    </ReactResponsive>
  )
}

module.exports = TitleBar
