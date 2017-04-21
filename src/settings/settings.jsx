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
    }
  },
  componentWillMount() {
    superagent.get('/gitlab/profile')
      .withCredentials()
      .then(r => {
        const doc = (new DOMParser).parseFromString(r.text, 'text/html')
        function copy(selector) {
          document.querySelector(selector).value = doc.querySelector(selector).value
        }
        copy('input[name=authenticity_token]')
        copy('input[name="user[email]"]')
        copy('input[name="user[name]"]')
      }).catch(e => console.error(e))
    //set the state to loading if it hasn't gotten the user info after a second
    setTimeout(() => {
      if (this.state.user == null) {
        this.setState({user: 'loading'})
      }
    }, 1000)
  },
  render() {
    const user = this.state.user || {}
    return (
      <div className='Settings'>
        <TitleBar>
          <div className='titleText'>
            {'Settings'}
          </div>
        </TitleBar>
        <semantic.Container>
          <semantic.Form encType="multipart/form-data" action="/gitlab/profile" acceptCharset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="✓" />
            <input type="hidden" name="_method" value="put" />
            <input name='authenticity_token' type='hidden' />
            <semantic.Grid>
              <semantic.Grid.Column width={6}>
                <label>Name</label>
                <semantic.Form.Input name='user[name]' type='text' />
                <label>Email</label>
                <semantic.Form.Input name='user[email]' type='text'/>
                <semantic.Button type='submit'>{'Save'}</semantic.Button>
              </semantic.Grid.Column>
            </semantic.Grid>
          </semantic.Form>
        </semantic.Container>
      </div>
    )
  }
})

module.exports = Settings
