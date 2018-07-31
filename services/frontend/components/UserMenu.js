import './UserMenu.scss'
import React from 'react'
import * as semantic from 'semantic-ui-react'

function UserMenu(props) {
  const user = props.user || {}
  return (
    <div className="UserMenu">
      <div className="userName">{user.username}</div>
      <semantic.Menu vertical attached>
        <semantic.Menu.Item href="/settings">
          <semantic.Icon name="settings" />
          Settings
        </semantic.Menu.Item>
        <semantic.Menu.Item href="/!gitlab/users/sign_out">
          <semantic.Icon name="sign out" />
          Sign out
        </semantic.Menu.Item>
      </semantic.Menu>
    </div>
  )
}

export default UserMenu
