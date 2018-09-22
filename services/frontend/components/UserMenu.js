import React from 'react'
import * as semantic from 'semantic-ui-react'
import {withRouter} from 'next/router'
import superagent from 'superagent'

import {Link} from '../routes'

import './UserMenu.scss'

class UserMenu extends React.Component {
  logout = () =>
    superagent
      .get('/!gitlab/users/sign_out')
      .then(r => this.props.router.push('/login'))
  render() {
    const user = this.props.user || {}
    return (
      <div className="UserMenu">
        <div className="userName">{user.username}</div>
        <semantic.Menu vertical attached>
          <Link prefetch href="/settings">
            <semantic.Menu.Item>
              <semantic.Icon name="settings" />
              Settings
            </semantic.Menu.Item>
          </Link>
          <semantic.Menu.Item onClick={this.logout}>
            <semantic.Icon name="sign out" />
            Log out
          </semantic.Menu.Item>
        </semantic.Menu>
      </div>
    )
  }
}

export default withRouter(UserMenu)
