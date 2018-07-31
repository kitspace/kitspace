import './TitleBar.scss'
import React from 'react'
import * as semantic from 'semantic-ui-react'

import UserMenu from './UserMenu'

export default function TitleBar(props) {
  const user = props.user
  const addProjectButton = (
    <semantic.Button
      className="addProjectButton"
      href="/submit"
      content="Add a project"
      color="green"
      icon="plus"
      labelPosition="left"
      style={{
        visibility: props.hideAddProjectButton ? 'hidden' : 'initial',
      }}
    />
  )
  let userButton
  if (!user) {
    userButton = (
      <semantic.Button basic inverted href="/login">
        {'Sign in'}
      </semantic.Button>
    )
  } else {
    userButton = (
      <semantic.Popup
        trigger={
          <a>
            <div className="userDropContainer">
              <semantic.Image
                style={{background: 'white'}}
                size="mini"
                rounded
                src={user.avatar_url}
              />
              <semantic.Icon inverted name="triangle down" />
            </div>
          </a>
        }
        on="click"
        offset={-20}
      >
        <UserMenu user={user} />
      </semantic.Popup>
    )
  }
  return (
    <div className="titleBar">
      <div className="logoContainer">
        <semantic.Menu inverted pointing secondary>
          <a href="/">
            <semantic.Image className="logoImg" src="/static/logo.svg" />
          </a>
          <semantic.Menu.Item />
          <semantic.Menu.Item active={props.active === '/'} href="/">
            {'Projects'}
          </semantic.Menu.Item>
          <semantic.Menu.Item active={props.active === '/about'} href="/about">
            {'About'}
          </semantic.Menu.Item>
        </semantic.Menu>
      </div>
      <div className="middleContainer">{props.children}</div>
      <div className="userMenu">
        {addProjectButton}
        <div className="userButtonContainer">{userButton}</div>
      </div>
    </div>
  )
}
