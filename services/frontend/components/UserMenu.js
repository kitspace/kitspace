import './UserMenu.scss'
import React from 'react'
import * as semantic from 'semantic-ui-react'
import Link from 'next/link'

function UserMenu(props) {
  const user = props.user || {}
  return (
    <div className="UserMenu">
      <div className="userName">{user.username}</div>
      <semantic.Menu vertical attached>
        <Link href="/settings">
        <semantic.Menu.Item>
          <semantic.Icon name="settings" />
          Settings
        </semantic.Menu.Item>
      </Link>
        <semantic.Menu.Item href="/!gitlab/users/sign_out">
          <semantic.Icon name="sign out" />
          Sign out
        </semantic.Menu.Item>
      </semantic.Menu>
    </div>
  )
}

export default UserMenu
