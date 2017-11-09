const React    = require('react')
const semantic = require('semantic-ui-react')

const UserMenu = require('./user_menu')

const TitleBar = React.createClass({
  render() {
    const user = this.props.user
    const addProjectButton = (
      <semantic.Button
        className='addProjectButton'
        href='/submit'
        content='Add a project'
        color='green'
        icon='plus'
        labelPosition='left'
        style={{
          visibility: this.props.hideAddProjectButton ? 'hidden' : 'initial'
        }}
      />
    )
    let userButton
    if (user === 'loading') {
      userButton = <semantic.Loader active inline />
    }
    else if (user === 'not signed in') {
      userButton = (
        <semantic.Button basic inverted href='/accounts/users/sign_in'>
          {'Sign in'}
        </semantic.Button>
      )
    }
    else if (user) {
      userButton = (
        <semantic.Popup
          trigger={
            <a>
              <div className='userDropContainer'>
                <semantic.Image
                  style={{background: 'white'}}
                  size='mini'
                  shape='rounded'
                  src={user.avatar_url}
                />
                <semantic.Icon inverted name='triangle down' />
              </div>
            </a>
          }
          on='click'
          offset={-20}
        >
        <UserMenu user={user} />
        </semantic.Popup>
      )
    }
    return (
      <div className='titleBar'>
        <div className='logoContainer'>
          <semantic.Menu inverted pointing secondary>
            <a href='/'>
              <semantic.Image className='logoImg' src='/images/logo.svg' />
            </a>
            <semantic.Menu.Item >
            </semantic.Menu.Item>
            <semantic.Menu.Item active={this.props.active === 'Projects'} href='/'>
              {'Projects'}
            </semantic.Menu.Item>
            <semantic.Menu.Item active={this.props.active === 'About'} href='/'>
              {'About'}
            </semantic.Menu.Item>
          </semantic.Menu>
        </div>
        <div className='middleContainer'>
          {this.props.children}
        </div>
        <div className='userMenu'>
          {addProjectButton}
          <div className='userButtonContainer'>
            {userButton}
          </div>
        </div>
      </div>
    )
  }
})

module.exports = TitleBar
