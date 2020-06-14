const React = require('react')
const semantic = require('semantic-ui-react')

function TitleBar(props) {
  const isSubmitRoute = RegExp('^/projects/new').test(props.route)
  const isProjectRoute =
    isSubmitRoute ||
    props.route === '/' ||
    RegExp('^/projects/').test(props.route)
  return (
    <div className="titleBar">
      <div className="bigSiteMenu">
        <semantic.Menu inverted pointing secondary>
          <a href="/">
            <semantic.Image className="logoImg" src="/images/logo.svg" />
          </a>
          <SiteMenuItems route={props.route} isProjectRoute={isProjectRoute} />
        </semantic.Menu>
      </div>
      <div className="bigSocialMenu">
        <semantic.Menu inverted pointing secondary>
          <SocialMenuItems isSubmitRoute={isSubmitRoute} />
        </semantic.Menu>
      </div>
      <div className="smallMenu">
        <a href="/">
          <semantic.Image className="logoImg" src="/images/logo.svg" />
        </a>
        <semantic.Popup
          trigger={
            <semantic.Button icon size="large" basic inverted>
              <semantic.Icon inverted name="bars" />
            </semantic.Button>
          }
          on="click"
          position="bottom right"
          inverted
          basic
        >
          <semantic.Menu inverted vertical>
            <SiteMenuItems
              route={props.route}
              isProjectRoute={isProjectRoute}
            />
            <SocialMenuItems isSubmitRoute={isSubmitRoute} />
          </semantic.Menu>
        </semantic.Popup>
      </div>
    </div>
  )
}

function SiteMenuItems(props) {
  return (
    <>
      <semantic.Menu.Item as="a" href="/" active={props.isProjectRoute}>
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
    </>
  )
}

function SocialMenuItems(props) {
  return (
    <>
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
      <semantic.Menu.Item as="a" href="https://opencollective.com/kitspace">
        <semantic.Icon name="heart" />
        Donate
      </semantic.Menu.Item>
      {props.isSubmitRoute ? null : (
        <semantic.Menu.Item>
          <semantic.Button
            icon
            labelPosition="left"
            color="green"
            href="/projects/new"
          >
            <semantic.Icon name="plus" />
            Add a project
          </semantic.Button>
        </semantic.Menu.Item>
      )}
    </>
  )
}


module.exports = TitleBar
