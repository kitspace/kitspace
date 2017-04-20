const Redux      = require('redux')
const React      = require('react')
const {h}        = require('react-hyperscript-helpers')
const path       = require('path')
const immutable  = require('immutable')
const superagent = require('superagent')
const {Router, Route, Link, hashHistory} = require('react-router')

const TitleBar = require('../title_bar')

const Settings = React.createClass({
  getInitialState() {
    return {
      user: null,
      emails: null,
    }
  },
  componentWillMount() {
    superagent.get('/gitlab/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => this.setState({user: r.body}))
      .catch(e => this.setState({user: 'not signed in'}))
    superagent.get('/gitlab/api/v4/user/emails')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => this.setState({emails: r.body}))
      .catch(e => this.setState({emails: 'error'}))
    //set the state to loading if it hasn't gotten the user info after a second
    setTimeout(() => {
      if (this.state.user == null) {
        this.setState({user: 'loading'})
      }
    }, 1000)
  },
  render() {
    return (
      <div>
        <TitleBar user={this.state.user}>
          <div className='titleText'>
            {'Settings'}
          </div>
        </TitleBar>
        <pre>
          {JSON.stringify(this.state.emails, null, 2)}
        </pre>
      </div>
    )
  }
})

module.exports = Settings
