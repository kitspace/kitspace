const React      = require('react')
const semantic   = require('semantic-ui-react')
const superagent = require('superagent')

const UserMenu = require('./user_menu')

const TitleBar = React.createClass({
  propTypes: {
    children: React.PropTypes.any,
    submissionButton: React.PropTypes.bool,
  },
  getInitialState() {
    return {
      user: null
    }
  },
  componentWillMount() {
    superagent.get('/gitlab/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => this.setState({user: r.body}))
      .catch(e => this.setState({user: false}))
  },
  render() {
    const user = this.state.user
    const addProjectButton = (
      <a className='addProjectButton' href='/submit'>
        <semantic.Button content='Add a project' color='green' icon='plus' labelPosition='left' />
      </a>
    )
    let userButton = <semantic.Loader active inline />
    if (user === false) {
      userButton = (
        <a href='/sign_in'>
          <semantic.Button basic inverted>
            {'Sign in'}
          </semantic.Button>
        </a>
      )
    }
    else if (user) {
      userButton = (
        <semantic.Popup
          trigger={
            <a>
              <semantic.Image size='mini' shape='rounded' src={user.avatar_url} />
            </a>
          }
          on='click'
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
