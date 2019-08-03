const React = require('react')
const semantic = require('semantic-ui-react')

function TitleBar(props) {
  const isProjectRoute =
    props.route === '/' || RegExp('^/boards/').test(props.route)
  const isSubmitRoute = RegExp('^/submit/').test(props.route)
  const addAProject = isProjectRoute ? (
    <div>
      <semantic.Button icon labelPosition="left" color="green" href="/submit">
        <semantic.Icon name="plus" />
        Add a project
      </semantic.Button>
    </div>
  ) : null
  return (
    <div className="titleBar">
      <div className="logoContainer">
        <semantic.Menu inverted pointing secondary>
          <a href="/">
            <semantic.Image className="logoImg" src="/images/logo.svg" />
          </a>
          <semantic.Menu.Item as="a" href="/" active={isProjectRoute || isSubmitRoute}>
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
      {addAProject}
    </div>
  )
}

module.exports = TitleBar
