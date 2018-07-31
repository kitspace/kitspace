import React from 'react'
import superagent from 'superagent'
import * as semantic from 'semantic-ui-react'

export default class ChangePassword extends React.Component {
  state = {passwordMessage: null}

  setPasswordMessage = passwordMessage => {
    this.setState({passwordMessage})
    setTimeout(() => {
      this.setState({passwordMessage: null})
    }, 5000)
  }

  render() {
    const props = this.props
    return (
      <>
        <semantic.Header as="h3" dividing>
          {'Password'}
        </semantic.Header>
        <form
          className={`ui form warning`}
          encType="multipart/form-data"
          acceptCharset="UTF-8"
          method="post"
          onSubmit={event => {
            event.preventDefault()
            const formData = new FormData(this.passwordForm)
            superagent
              .post('/!gitlab/profile/password')
              .send(formData)
              .set('Accept', 'application/json')
              .then(r => {
                window.location = '/login'
              })
              .catch(e => {
                this.setPasswordMessage('Changing password failed')
              })
          }}
          ref={form => (this.passwordForm = form)}
        >
          <semantic.Form.Input
            label="Current Password"
            required
            type="password"
            name="user[current_password]"
          />
          <semantic.Form.Input
            label="New Password"
            required
            type="password"
            name="user[password]"
          />
          <semantic.Form.Input
            label="Confirm New Password"
            required
            type="password"
            name="user[password_confirmation]"
          />
          <input
            name="authenticity_token"
            type="hidden"
            value={props.authenticity_token}
          />
          <semantic.Button type="submit">{'Change password'}</semantic.Button>
          <semantic.Message
            style={{
              visibility: this.state.passwordMessage ? 'visible' : 'hidden',
            }}
            negative
          >
            {this.state.passwordMessage ? this.state.passwordMessage : '-'}
          </semantic.Message>
        </form>
      </>
    )
  }
}
