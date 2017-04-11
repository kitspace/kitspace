const React      = require('react')
const semantic   = require('semantic-ui-react')
const superagent = require('superagent')

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
  signOut() {
    return getSignOutToken().then(token => {
      return superagent.post('/gitlab/users/sign_out')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .withCredentials()
        .send('_method=delete')
        .send(`authenticity_token=${token}`)
        .then(r => this.setState({user: false}))
    })
  },
  render() {
    const user = this.state.user
    console.log(user)
    let button
    if (user === false) {
      button = (
        <a href='/sign_in'>
          <semantic.Button basic inverted>
            {'Sign in'}
          </semantic.Button>
        </a>
      )
    }
    else if (user != null) {
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
            <semantic.Menu.Item onClick={this.signOut}>Sign out</semantic.Menu.Item>
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
