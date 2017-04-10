const React      = require('react')
const semantic   = require('semantic-ui-react')
const superagent = require('superagent')

function getLogoutToken() {
  return superagent.get('/gitlab/profile')
    .withCredentials()
    .then(r => {
      return (new DOMParser).parseFromString(r.text, 'text/html')
    }).then(doc => {
      const input = doc.querySelector('input[name=authenticity_token]')
      if (input == null) {
        return ''
      }
      return input.value
    })
}


const TitleBar = React.createClass({
  propTypes: {
    children: React.PropTypes.any,
    submissionButton: React.PropTypes.bool,
  },
  getInitialState() {
    return {
      user: null,
      logoutToken: '',
    }
  },
  componentWillMount() {
    superagent.get('/gitlab/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => this.setState({user: r.body}))

    getLogoutToken().then(logoutToken => this.setState({logoutToken}))
  },
  render() {
    const user = this.state.user
    let button = (
      <a href='/sign_in'>
        <semantic.Button basic inverted>
          {'Sign in'}
        </semantic.Button>
      </a>
    )
    if (user != null) {
      button = (
        <semantic.Popup
          trigger={
            <a>
              <semantic.Image size='mini' shape='rounded' src={user.avatar_url} />
            </a>
          }
          on='click'
        >
          <semantic.Menu
            vertical
          >
            <semantic.Form method='post' action='/gitlab/users/sign_out'>
              <semantic.Form.Input  type='hidden'  name='_method' value='delete' />
              <semantic.Form.Input  type='hidden'  name='authenticity_token' value={this.state.logoutToken} />
              <semantic.Form.Input type='submit'   name='commit'             value='Sign out' />
            </semantic.Form>
          </semantic.Menu>
        </semantic.Popup>
      )
    }
    return (
      <div className='titleBar'>
        <div className='logoContainer'>
          <a href='/'>
            <img className='logoImg' src='/images/logo.svg' />
          </a>
        </div>
        <div className='middleContainer'>
          {this.props.children}
        </div>
        <div className='submitContainer'>
          {button}
        </div>
      </div>
    )
  }
})

module.exports = TitleBar
