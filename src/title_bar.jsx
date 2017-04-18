const React      = require('react')
const semantic   = require('semantic-ui-react')
const superagent = require('superagent')

const UserMenu = require('./user_menu')

function getSignOutToken() {
  return superagent.get('/gitlab/profile')
    .withCredentials()
    .then(r => {
      return (new DOMParser).parseFromString(r.text, 'text/html')
    }).then(doc => {
      const input = doc.querySelector('input[name=authenticity_token]')
      if (input == null) {
        throw Error('Could not get token')
      }
      return input.value
    })
}
function signOut() {
  return getSignOutToken().then(token => {
    const auth = document.querySelector('input[name=authenticity_token]')
    auth.value = token
    const form = auth.parentElement
    form.submit()
  })
}

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
          <semantic.Button loading={user == null} basic inverted>
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
        <UserMenu />
        </semantic.Popup>
      )
    }
    return (
      <div className='titleBar'>
        <form style={{display: 'none'}} method='post' action='/gitlab/users/sign_out'>
          <input  type='hidden'  name='_method' value='delete' />
          <input  type='hidden'  name='authenticity_token' />
        </form>
        <div className='logoContainer'>
          <a href='/'>
            <img className='logoImg' src='/images/logo.svg' />
          </a>
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
