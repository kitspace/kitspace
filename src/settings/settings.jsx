const Redux       = require('redux')
const React       = require('react')
const superagent  = require('superagent')
const semantic    = require('semantic-ui-react')
const htmlToReact = new (new require('html-to-react')).Parser(React).parse
const CustomAvatarEditor = require('./custom_avatar_editor')

const TitleBar = require('../title_bar')

const defaultMessage = 'We also use email for avatar detection if no avatar is uploaded.'

function checkGravater(url) {
  return /\/accounts\/uploads\/user\/avatar/.test(url)
}

const Settings = React.createClass({
  getInitialState() {
    return {
      emailMessage: '',
      user: {},
      newAvatarBlob: null,
      newAvatarUrl: null,
      modalOpen: false,
      submitMessage: null,
      authenticity_token: '',
      removingAvatar: false,
    }
  },
  getUser() {
    return superagent.get('/accounts/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => {
        const newUser     = r.body
        const notGravatar = checkGravater(this.state.user.avatar_url)
        //force a re-render of the avatar if it's the same link but likely changed
        if (notGravatar && this.state.user.avatar_url === newUser.avatar_url) {
          newUser.avatar_url += '?' + Math.random()
        }
        this.setState({user: newUser, newAvatarUrl: null})
      }).catch(e => window.location='/accounts/users/sign_in')
  },

  getForm() {
    return superagent.get('/accounts/profile')
      .withCredentials()
      .then(r => {
        const doc = (new DOMParser).parseFromString(r.text, 'text/html')
        function copy(selector) {
          document.querySelector(selector).value = doc.querySelector(selector).value
        }
        copy('input[name="user[email]"]')
        copy('input[name="user[name]"]')
        const authenticity_token = doc.querySelector('input[name=authenticity_token]').value
        const emailMessage = doc.querySelector('input[name="user[email]"]').nextElementSibling.innerHTML
        this.setState({emailMessage, authenticity_token})
      }).catch(e => console.error(e))
  },

  componentDidMount() {
    this.getUser()
    this.getForm()
  },

  setRawImage(event) {
    const reader = new FileReader()
    const file   = document.querySelector('input[type=file]').files[0]
    reader.addEventListener('load', () => {
      this.setState({
        rawImage: reader.result,
        modalOpen: true,
      })
    }, false)
    if (file) {
      reader.readAsDataURL(file)
    }
  },

  handleSave() {
    if (this.editor) {
      const image = this.editor.getImageScaledToCanvas()
      this.setState({newAvatarUrl: image.toDataURL()})
      image.toBlob(blob => {
        this.setState({newAvatarBlob: blob})
      })
    }
    this.setState({modalOpen: false})
  },

  setSubmitMessage(submitMessage) {
    this.setState({submitMessage})
    setTimeout(() => {
      this.setState({submitMessage: null})
    }, 5000)
  },

  render() {
    const user         = this.state.user || {}
    const emailWarning = this.state.emailMessage !== defaultMessage
    const warning      = emailWarning && this.state.emailMessage !== ''
    const notGravatar  = checkGravater(this.state.user.avatar_url)
    let avatarImage = (
     <semantic.Image
       as='a'
       style={{height: 80, width: 80}}
       src={this.state.newAvatarUrl || this.state.user.avatar_url}
     />
    )
    if (this.state.removingAvatar) {
      avatarImage = <div style={{height: 80, width: 80}} />
    }
    let removeAvatarLink = <a></a>
    if ((! this.state.removingAvatar) &&  notGravatar) {
      removeAvatarLink = (
        <a
          className='removeAvatarLink'
          onClick={event => {
            const confirmation = window.confirm('Are you sure you want to remove the avatar picture?')
            if (confirmation) {
              this.setState({removingAvatar: true})
              superagent.post('/accounts/profile/avatar')
                 .field('authenticity_token', this.state.authenticity_token)
                 .field('_method', 'delete')
                 .then(r => {
                   this.getForm()
                   this.getUser().then(() => this.setState({removingAvatar: false}))
                 }).catch(e => {
                   console.error(e)
                 })
            }
          }}
        >
          <semantic.Icon name='trash' />
          {'remove'}
        </a>
      )
    }
    return (
      <div className='Settings'>
        <TitleBar user={this.state.user}>
          <div className='titleText'>
            {'Settings'}
          </div>
        </TitleBar>
        <semantic.Container>
            <input name='authenticity_token' type='hidden' value={this.state.authenticity_token} />
            <semantic.Grid>
              <semantic.Grid.Column mobile={14} tablet={10} computer={8}>
                <semantic.Header as='h3' dividing >{'Profile'}</semantic.Header>
                <form
                  className={`ui arge form ${warning ? 'warning' : ''}`}
                  encType='multipart/form-data'
                  acceptCharset='UTF-8'
                  method='post'
                  onSubmit={event => {
                    event.preventDefault()
                    const formData = new FormData(this.form)
                    if (this.state.newAvatarBlob != null) {
                      formData.append('user[avatar]', this.state.newAvatarBlob, 'avatar.png')
                    }
                    superagent.post('/accounts/profile')
                      .send(formData)
                      .set('Accept', 'application/json')
                      .then(r => {
                        this.setSubmitMessage({text: r.body.message, type: 'success'})
                        this.getUser()
                        this.getForm()
                      }).catch(e => {
                        this.setSubmitMessage({text: 'Profile update failed.', type: 'failed'})
                      })
                  }}
                  ref={form => this.form = form}
                >
                  <input name='utf8' type='hidden' value='✓' />
                  <input type='hidden' name='_method' value='put' />
                  {'Avatar'}
                  <div style={{display: 'flex', alignItems:'center'}} >
                    <semantic.Segment compact>
                      <label htmlFor='fileInput'>
                        {avatarImage}
                      </label>
                      <input
                        style={{
                          opacity: 0,
                          position: 'absolute',
                          zIndex: -1
                        }}
                        id='fileInput'
                        accept='image/*'
                        type='file'
                        onChange={this.setRawImage}
                      />
                      <semantic.Modal
                        trigger={<div></div>}
                        open={this.state.modalOpen}
                        onOpen={() => this.setState({modalOpen: true})}
                        onClose={this.handleSave}
                        size='small'
                      >
                        <semantic.Modal.Content>
                          <CustomAvatarEditor
                            ref={customEditor => this.editor = (customEditor || {}).editor}
                            image={this.state.rawImage}
                          />
                        </semantic.Modal.Content>
                        <semantic.Modal.Actions>
                          <semantic.Button primary onClick={this.handleSave}>{'Ok'}</semantic.Button>
                        </semantic.Modal.Actions>
                      </semantic.Modal>
                  </semantic.Segment>
                  {removeAvatarLink}
                </div>
                <label>{'Real Name'}</label>
                <semantic.Form.Input name='user[name]' type='text' />
                <label>Email</label>
                <semantic.Form.Input name='user[email]' type='text'/>
                <semantic.Message size='tiny' warning={emailWarning} id='emailMessage'>
                  {htmlToReact(`<div>${this.state.emailMessage}</div>`)}
                </semantic.Message>
                <semantic.Button type='submit'>{'Save'}</semantic.Button>
                <semantic.Message
                  style={{visibility: this.state.submitMessage ? 'visible' : 'hidden'}}
                  positive={this.state.submitMessage && this.state.submitMessage.type === 'success'}
                  negative={this.state.submitMessage && this.state.submitMessage.type !== 'success'}
                >
                  {this.state.submitMessage ? this.state.submitMessage.text : '-'}
                </semantic.Message>
                <semantic.Header as='h3' dividing >{'Password'}</semantic.Header>
            </form>
            <form
              className={`ui form ${warning ? 'warning' : ''}`}
              encType='multipart/form-data'
              acceptCharset='UTF-8'
              method='post'
              onSubmit={event => {
                event.preventDefault()
                const formData = new FormData(this.passwordForm)
                superagent.post('/accounts/profile/password')
                  .send(formData)
                  .set('Accept', 'application/json')
                  .then(r => {
                    window.location='/accounts/users/sign_in'
                  }).catch(e => {
                    console.error(e)
                  })
              }}
              ref={form => this.passwordForm = form}
            >
              <label>{'Current Password'}</label>
              <semantic.Form.Input required="required" type="password" name="user[current_password]" />
              <label>{'New Password'}</label>
              <semantic.Form.Input required="required" type="password" name="user[password]" />
              <label>{'Confirm New Password'}</label>
              <semantic.Form.Input required="required" type="password" name="user[password_confirmation]" />
              <input name='authenticity_token' type='hidden' value={this.state.authenticity_token} />
              <semantic.Button type='submit'>{'Change password'}</semantic.Button>
            </form>
              </semantic.Grid.Column>
            </semantic.Grid>
        </semantic.Container>
      </div>
    )
  }
})

module.exports = Settings
