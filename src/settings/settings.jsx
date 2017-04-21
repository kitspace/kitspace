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
      token: '',
    }
  },
  componentWillMount() {
    superagent.get('/gitlab/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => this.setState({user: r.body}))
      .catch(e => this.setState({user: 'not signed in'}))
    superagent.get('/gitlab/profile')
      .withCredentials()
      .then(r => {
        const doc   = (new DOMParser).parseFromString(r.text, 'text/html')
        const token = doc.querySelector('input[name=authenticity_token]').value
        const email = doc.querySelector('input[name="user[email]"]').value
        const name  = doc.querySelector('input[name="user[name]"]').value
        document.querySelector('input[name=authenticity_token]').value = token
        document.querySelector('input[name="user[email]"]').value      = email
        document.querySelector('input[name="user[name]"]').value       = name
      }).catch(e => console.error(e))
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
  submitForm(event) {
    event.preventDefault()
    const email = document.querySelector('input[name=email]').value
    superagent.post('/gitlab/api/v4/user/emails')
      .withCredentials()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({email})
      .then(r => console.log(r.body))
      .catch(e => console.log(e))
  },
  render() {
    const user = this.state.user || {}
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
          <semantic.Form encType="multipart/form-data" action="/gitlab/profile" acceptCharset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="✓" />
            <input type="hidden" name="_method" value="put" />
            <input name='authenticity_token' type='hidden' />
            <semantic.Form.Input name='user[name]' type='text' />
            <semantic.Form.Input name='user[email]' type='text'/>
            <semantic.Button type='submit'>{'Save'}</semantic.Button>
          </semantic.Form>
        </semantic.Container>
      </div>
    )
  }
})

module.exports = Settings
