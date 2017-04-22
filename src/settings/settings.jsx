const Redux       = require('redux')
const React       = require('react')
const superagent  = require('superagent')
const semantic    = require('semantic-ui-react')
const htmlToReact = new (new require('html-to-react')).Parser(React).parse

const TitleBar = require('../title_bar')

const defaultMessage = 'We also use email for avatar detection if no avatar is uploaded.'
const Settings = React.createClass({
  getInitialState() {
    return {
      emailMessage: ''
    }
  },
  componentWillMount() {
    superagent.get('/accounts/profile')
      .withCredentials()
      .then(r => {
        const doc = (new DOMParser).parseFromString(r.text, 'text/html')
        function copy(selector) {
          document.querySelector(selector).value = doc.querySelector(selector).value
        }
        copy('input[name=authenticity_token]')
        copy('input[name="user[email]"]')
        copy('input[name="user[name]"]')
        const emailMessage = doc.querySelector('input[name="user[email]"]').nextElementSibling.innerHTML
        this.setState({emailMessage})
      }).catch(e => console.error(e))
  },
  render() {
    const user = this.state.user || {}
    const emailWarning = this.state.emailMessage !== defaultMessage
    return (
      <div className='Settings'>
        <TitleBar>
          <div className='titleText'>
            {'Settings'}
          </div>
        </TitleBar>
        <semantic.Container>
          <semantic.Form
            warning={emailWarning && this.state.emailMessage !== ''}
            encType="multipart/form-data" action="/accounts/profile"
            acceptCharset="UTF-8"
            method="post"
          >
            <input name="utf8" type="hidden" value="✓" />
            <input type="hidden" name="_method" value="put" />
            <input name='authenticity_token' type='hidden' />
            <semantic.Grid>
              <semantic.Grid.Column mobile={14} tablet={10} computer={8}>
                <label>Name</label>
                <semantic.Form.Input name='user[name]' type='text' />
                <label>Email</label>
                <semantic.Form.Input name='user[email]' type='text'/>
                <semantic.Message warning={emailWarning} id='emailMessage'>
                  {htmlToReact(`<div>${this.state.emailMessage}</div>`)}
                </semantic.Message>
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
