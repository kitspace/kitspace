const React = require('react')
const semantic = require('semantic-ui-react')

function TitleBar(props) {
  const isProjectRoute =
    props.route === '/' || RegExp('^/boards/').test(props.route)
  const isSubmitRoute = RegExp('^/submit/').test(props.route)
  const addAProject = isSubmitRoute ? null : (
    <semantic.Menu.Item>
      <semantic.Button icon labelPosition="left" color="green" href="/submit">
        <semantic.Icon name="plus" />
        Add a project
      </semantic.Button>
    </semantic.Menu.Item>
  )
  return (
    <div className="titleBar">
      <div className="logoContainer">
        <semantic.Menu inverted pointing secondary stackable>
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
      <div className="rightButtons">
        <semantic.Menu
          className="socialMenu"
          inverted
          pointing
          secondary
          stackable
          size="small"
        >
          <semantic.Menu.Item
            as="a"
            href="https://riot.im/app/#/room/#kitspace:matrix.org"
          >
            <semantic.Icon name="chat" />
            Chat
          </semantic.Menu.Item>
          <semantic.Menu.Item as="a" href="https://twitter.com/kitspaceorg">
            <semantic.Icon name="twitter" />
            Twitter
          </semantic.Menu.Item>
          <semantic.Menu.Item as="a" href="https://github.com/kitspace">
            <semantic.Icon name="github" />
            GitHub
          </semantic.Menu.Item>
          {addAProject}
        </semantic.Menu>
      </div>
    </div>
  )
}

module.exports = TitleBar
