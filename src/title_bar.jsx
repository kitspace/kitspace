const React      = require('react')
const semantic   = require('semantic-ui-react')
const superagent = require('superagent')

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
        <a>
          <semantic.Image size='mini' shape='rounded' src={user.avatar_url} />
        </a>
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
