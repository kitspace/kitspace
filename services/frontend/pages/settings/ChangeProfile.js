import React from 'react'
import superagent from 'superagent'
import * as semantic from 'semantic-ui-react'

import CustomAvatarEditor from './CustomAvatarEditor'
import {checkGravatar} from './util'

export default class ChangeProfile extends React.Component {
  state = {
    emailReSent: false,
    modalOpen: false,
    removingAvatar: false,
    newAvatarBlob: null,
    newAvatarUrl: null,
    profileMessage: null,
  }

  setProfileMessage = profileMessage => {
    this.setState({profileMessage})
    setTimeout(() => {
      this.setState({profileMessage: null})
    }, 5000)
  }

  setRawImage = event => {
    const reader = new FileReader()
    const file = document.querySelector('input[type=file]').files[0]
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          rawImage: reader.result,
          modalOpen: true,
        })
      },
      false,
    )
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  handleSave = () => {
    if (this.editor) {
      const image = this.editor.getImageScaledToCanvas()
      this.setState({newAvatarUrl: image.toDataURL()})
      image.toBlob(blob => {
        this.setState({newAvatarBlob: blob})
      })
    }
    this.setState({modalOpen: false})
  }

  render() {
    const user = this.props.user
    const warning = this.props.confirmationEmail != null
    const notGravatar = checkGravatar(user.avatar_url)
    if (this.props.emailReSent) {
      var emailReSendMessage = 'Email has been re-sent.'
    } else {
      var emailReSendMessage = (
        <a
          onClick={event => {
            event.preventDefault()
            superagent
              .post(
                `/!gitlab/users/confirmation?user_email=${
                  this.props.confirmationEmail
                }`,
              )
              .field('_method', 'post')
              .field('authenticity_token', this.props.authenticity_token)
              .then(r => this.setState({emailReSent: true}))
              .catch(e => console.error(e))
          }}
          href="#"
        >
          {'Re-send confirmation email.'}
        </a>
      )
    }
    let avatarImage = (
      <semantic.Image
        as="a"
        style={{height: 80, width: 80}}
        src={this.state.newAvatarUrl || user.avatar_url}
      />
    )
    if (this.state.removingAvatar) {
      avatarImage = <div style={{height: 80, width: 80}} />
    }
    let removeAvatarLink = <a />
    if (!this.state.removingAvatar && notGravatar) {
      removeAvatarLink = (
        <a
          className="removeAvatarLink"
          onClick={event => {
            const confirmation = window.confirm(
              'Are you sure you want to remove the avatar picture?',
            )
            if (confirmation) {
              this.setState({removingAvatar: true})
              superagent
                .post('/!gitlab/profile/avatar')
                .field('authenticity_token', this.props.authenticity_token)
                .field('_method', 'delete')
                .then(r => {
                  this.props.getForm()
                  this.props
                    .getUser()
                    .then(() => this.setState({removingAvatar: false}))
                })
                .catch(e => {
                  console.error(e)
                })
            }
          }}
        >
          <semantic.Icon name="trash" />
          {'remove'}
        </a>
      )
    }
    return (
      <>
        <semantic.Header as="h3" dividing>
          {'Profile'}
        </semantic.Header>
        <form
          className={`ui large form ${warning ? 'warning' : ''}`}
          encType="multipart/form-data"
          acceptCharset="UTF-8"
          method="post"
          onSubmit={event => {
            event.preventDefault()
            const formData = new FormData(this.profileForm)
            if (this.state.newAvatarBlob != null) {
              formData.append(
                'user[avatar]',
                this.state.newAvatarBlob,
                'avatar.png',
              )
            }
            superagent
              .post('/!gitlab/profile')
              .send(formData)
              .set('Accept', 'application/json')
              .then(r => {
                this.setProfileMessage({
                  text: r.body.message,
                  type: 'success',
                })
                this.props.getUser()
                this.props.getForm()
              })
              .catch(e => {
                this.setProfileMessage({
                  text: 'Profile update failed.',
                  type: 'failed',
                })
              })
          }}
          ref={form => (this.profileForm = form)}
        >
          <input name="utf8" type="hidden" value="✓" />
          <input type="hidden" name="_method" value="put" />
          <input
            name="authenticity_token"
            type="hidden"
            value={this.props.authenticity_token}
          />
          <label style={{fontSize: 13, fontWeight: 'bold'}}>{'Avatar'}</label>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <semantic.Segment compact>
              <label htmlFor="fileInput">{avatarImage}</label>
              <input
                style={{
                  opacity: 0,
                  position: 'absolute',
                  zIndex: -1,
                }}
                id="fileInput"
                accept="image/*"
                type="file"
                onChange={this.setRawImage}
              />
              <semantic.Modal
                trigger={<div />}
                open={this.state.modalOpen}
                onOpen={() => this.setState({modalOpen: true})}
                onClose={this.handleSave}
                size="small"
              >
                <semantic.Modal.Content>
                  <CustomAvatarEditor
                    ref={customEditor =>
                      (this.editor = (customEditor || {}).editor)
                    }
                    image={this.state.rawImage}
                  />
                </semantic.Modal.Content>
                <semantic.Modal.Actions>
                  <semantic.Button primary onClick={this.handleSave}>
                    {'Ok'}
                  </semantic.Button>
                </semantic.Modal.Actions>
              </semantic.Modal>
            </semantic.Segment>
            {removeAvatarLink}
          </div>
          <semantic.Form.Input label="Real Name" name="user[name]" type="text" />
          <semantic.Form.Input label="Email" name="user[email]" type="text" />
          <semantic.Message
            size="tiny"
            warning={!this.state.emailReSent}
            id="emailMessage"
          >
            {'A confirmation email has been sent to '}
            <strong>{this.props.confirmationEmail}</strong>
            {'. Please click the link in the email before continuing. '}
            {emailReSendMessage}
          </semantic.Message>
          <semantic.Button type="submit">{'Save'}</semantic.Button>
          <semantic.Message
            style={{
              visibility: this.state.profileMessage ? 'visible' : 'hidden',
            }}
            positive={
              this.state.profileMessage &&
              this.state.profileMessage.type === 'success'
            }
            negative={
              this.state.profileMessage &&
              this.state.profileMessage.type !== 'success'
            }
          >
            {this.state.profileMessage ? this.state.profileMessage.text : '-'}
          </semantic.Message>
        </form>
      </>
    )
  }
}
