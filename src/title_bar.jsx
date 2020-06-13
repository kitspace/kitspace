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
                href="/bom-builder"
                active={props.route === '/bom-builder/'}
              >
                {'BOM Builder'}
              </semantic.Menu.Item>
              <semantic.Menu.Item
                as="a"
                href="/1-click-bom"
                active={props.route === '/1-click-bom/'}
              >
                {'1-click BOM'}
              </semantic.Menu.Item>
            </semantic.Menu>
          </div>
          <div className="rightButtonsContainer">
            <semantic.Menu basic inverted stackable={matches}>
              {isSubmitRoute ? null : (
                <semantic.Menu.Item>
                  <semantic.Button
                    icon
                    labelPosition="left"
                    color="green"
                    href="/submit"
                  >
                    <semantic.Icon name="plus" />
                    Add a project
                  </semantic.Button>
                </semantic.Menu.Item>
              )}
              <semantic.Popup
                trigger={
                  <semantic.Menu.Item className="contact-button">
                    <semantic.Button labelPosition="right" icon color="blue">
                      <semantic.Icon inverted name="comments" />
                      Make contact
                    </semantic.Button>
                  </semantic.Menu.Item>
                }
                on="click"
                position="bottom right"
                color="blue"
              >
                <semantic.Menu color="blue" secondary vertical>
                  <semantic.Menu.Item
                    as="a"
                    href="https://riot.im/app/#/room/#kitspace:matrix.org"
                  >
                    <semantic.Icon name="chat" />
                    Chat
                  </semantic.Menu.Item>
                  <semantic.Menu.Item as="a" href="/newsletter/">
                    <semantic.Icon name="envelope" />
                    Newsletter
                  </semantic.Menu.Item>
                  <semantic.Menu.Item
                    as="a"
                    href="https://twitter.com/kitspaceorg"
                  >
                    <semantic.Icon name="twitter" />
                    Twitter
                  </semantic.Menu.Item>
                  <semantic.Menu.Item as="a" href="https://github.com/kitspace">
                    <semantic.Icon name="github" />
                    GitHub
                  </semantic.Menu.Item>
                  <semantic.Menu.Item
                    as="a"
                    href="https://opencollective.com/kitspace"
                  >
                    <semantic.Icon name="heart" />
                    Donate
                  </semantic.Menu.Item>
                </semantic.Menu>
              </semantic.Popup>
            </semantic.Menu>
          </div>
        </div>
      )}
    </ReactResponsive>
  )
}

module.exports = TitleBar
