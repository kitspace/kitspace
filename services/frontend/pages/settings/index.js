import './settings.scss'
import React from 'react'
import superagent from 'superagent'
import * as semantic from 'semantic-ui-react'
import Head from 'next/head'

import Gitlab from 'kitspace-gitlab-client'
import TitleBar from '../../components/TitleBar'
import CustomAvatarEditor from './CustomAvatarEditor'

export default class Settings extends React.Component {
  state = {
    emailMessage: '',
    user: null,
    newAvatarBlob: null,
    newAvatarUrl: null,
    modalOpen: false,
    profileMessage: null,
    passwordMessage: null,
    authenticity_token: '',
    removingAvatar: false,
    emailReSent: false,
  }
  getUser = () => {
    return superagent
      .get('/!gitlab/api/v4/user')
      .set('Accept', 'application/json')
      .then(r => {
        const newUser = r.body
        const notGravatar = checkGravater(newUser.avatar_url)
        //force a re-render of the avatar
        if (notGravatar) {
          newUser.avatar_url += '?' + Math.random()
        }
        this.setState({user: newUser, newAvatarUrl: null})
      })
  }
  getForm = () => {
    return superagent
      .get('/!gitlab/profile')
      .withCredentials()
      .then(r => {
        const doc = new DOMParser().parseFromString(r.text, 'text/html')
        function copy(selector) {
          document.querySelector(selector).value = doc.querySelector(selector).value
        }
        copy('input[name="user[email]"]')
        copy('input[name="user[name]"]')
        const authenticity_token = doc.querySelector(
          'input[name=authenticity_token]',
        ).value
        const emailMessage = doc.querySelector('input[name="user[email]"]')
          .nextElementSibling
        const email = (emailMessage.querySelector('strong') || {}).innerHTML
        this.setState({confirmationEmail: email, authenticity_token})
      })
      .catch(e => console.error(e))
  }

  componentDidMount() {
    this.getForm()
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

  setProfileMessage = profileMessage => {
    this.setState({profileMessage})
    setTimeout(() => {
      this.setState({profileMessage: null})
    }, 5000)
  }

  setPasswordMessage = passwordMessage => {
    this.setState({passwordMessage})
    setTimeout(() => {
      this.setState({passwordMessage: null})
    }, 5000)
  }

  render() {
    const user = this.state.user || this.props.user
    const warning = this.state.confirmationEmail != null
    const notGravatar = checkGravater(user.avatar_url)
    if (this.state.emailReSent) {
      var emailReSendMessage = 'Email has been re-sent.'
    } else {
      var emailReSendMessage = (
        <a
          onClick={event => {
            event.preventDefault()
            superagent
              .post(
                `/!gitlab/users/confirmation?user_email=${
                  this.state.confirmationEmail
                }`,
              )
              .field('_method', 'post')
              .field('authenticity_token', this.state.authenticity_token)
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
                .field('authenticity_token', this.state.authenticity_token)
                .field('_method', 'delete')
                .then(r => {
                  this.getForm()
                  this.getUser().then(() => this.setState({removingAvatar: false}))
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
        <Head>
          <title>Kitspace - Settings</title>
        </Head>
        <TitleBar user={user} />
        <div className="Settings">
          <semantic.Container>
            <semantic.Grid>
              <semantic.Grid.Column mobile={14} tablet={10} computer={8}>
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
                        this.getUser()
                        this.getForm()
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
                    value={this.state.authenticity_token}
                  />
                  <label style={{fontSize: 13, fontWeight: 'bold'}}>
                    {'Avatar'}
                  </label>
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
                  <semantic.Form.Input
                    label="Real Name"
                    name="user[name]"
                    type="text"
                  />
                  <semantic.Form.Input
                    disabled={!!this.state.confirmationEmail}
                    label="Email"
                    name="user[email]"
                    type="text"
                  />
                  <semantic.Message
                    size="tiny"
                    warning={!this.state.emailReSent}
                    id="emailMessage"
                  >
                    {'A confirmation email has been sent to '}
                    <strong>{this.state.confirmationEmail}</strong>
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
                    {this.state.profileMessage
                      ? this.state.profileMessage.text
                      : '-'}
                  </semantic.Message>
                  <semantic.Header as="h3" dividing>
                    {'Password'}
                  </semantic.Header>
                </form>
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
                        window.location = '/!gitlab/users/sign_in'
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
                    value={this.state.authenticity_token}
                  />
                  <semantic.Button type="submit">
                    {'Change password'}
                  </semantic.Button>
                  <semantic.Message
                    style={{
                      visibility: this.state.passwordMessage ? 'visible' : 'hidden',
                    }}
                    negative
                  >
                    {this.state.passwordMessage ? this.state.passwordMessage : '-'}
                  </semantic.Message>
                </form>
              </semantic.Grid.Column>
            </semantic.Grid>
          </semantic.Container>
        </div>
      </>
    )
  }
}

function checkGravater(url) {
  return RegExp('/!gitlab/uploads/-/system/user/avatar/').test(url)
}
