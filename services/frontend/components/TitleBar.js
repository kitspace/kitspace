import './TitleBar.scss'
import React from 'react'
import * as semantic from 'semantic-ui-react'
import Link from 'next/link'

import UserMenu from './UserMenu'

export default function TitleBar(props) {
  const user = props.user
  const addProjectButton = (
    <Link href="/new">
      <semantic.Button
        className="addProjectButton"
        content="Add a project"
        color="green"
        icon="plus"
        labelPosition="left"
        style={{
          visibility: props.active === '/new' ? 'hidden' : 'initial',
        }}
      />
    </Link>
  )
  let userButton
  if (!user) {
    userButton = (
      <Link href="/login">
        <semantic.Button basic inverted>
          {'Sign in'}
        </semantic.Button>
      </Link>
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
        basic
      >
        <UserMenu user={user} />
      </semantic.Popup>
    )
  }
  return (
    <div className="titleBar">
      <div className="logoContainer">
        <semantic.Menu inverted pointing secondary>
          <Link href="/">
            <a>
              <semantic.Image className="logoImg" src="/static/logo.svg" />
            </a>
          </Link>
          <Link href="/">
            <semantic.Menu.Item active={props.active === '/'}>
              {'Projects'}
            </semantic.Menu.Item>
          </Link>
          <Link href="/about">
            <semantic.Menu.Item active={props.active === '/about'}>
              {'About'}
            </semantic.Menu.Item>
          </Link>
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
