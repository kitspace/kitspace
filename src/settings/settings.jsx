const Redux      = require('redux')
const React      = require('react')
const {h}        = require('react-hyperscript-helpers')
const path       = require('path')
const immutable  = require('immutable')
const superagent = require('superagent')
const semantic   = require('semantic-ui-react')
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
    function submit(e) {
      e.preventDefault()
      const email = document.querySelector('input[name=email]').value
      superagent.post('/gitlab/api/v4/user/emails')
        .withCredentials()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({email})
        .then(r => console.log(r.body))
        .catch(e => console.log(e))
    }
    return (
      <div>
        <TitleBar user={this.state.user}>
          <div className='titleText'>
            {'Settings'}
          </div>
        </TitleBar>
        <semantic.Container>
          <pre>
            {(this.state.user || {}).email}
          </pre>
          <pre>
            {JSON.stringify(this.state.emails, null, 2)}
          </pre>
          <semantic.Form onSubmit={submit} >
            <semantic.Form.Input name='email' type='text' />
            <semantic.Form.Input type='submit' />
          </semantic.Form>
        </semantic.Container>
      </div>
    )
  }
})

module.exports = Settings
