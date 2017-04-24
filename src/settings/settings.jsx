const Redux        = require('redux')
const React        = require('react')
const superagent   = require('superagent')
const semantic     = require('semantic-ui-react')
const htmlToReact  = new (new require('html-to-react')).Parser(React).parse
const CustomAvatarEditor = require('./custom_avatar_editor')

const TitleBar = require('../title_bar')

const defaultMessage = 'We also use email for avatar detection if no avatar is uploaded.'

const Settings = React.createClass({
  getInitialState() {
    return {
      emailMessage: '',
      user: {},
      newAvatarBlob: null,
      newAvatarUrl: null,
      modalOpen: false,
      rawImageBlob: '',
    }
  },
  componentWillMount() {
    superagent.get('/accounts/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => {
        this.setState({user: r.body})
      })
      .catch(e => this.setState({user: 'not signed in'}))
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
      reader.readAsDataURL(file);
    }
  },

  handleSave() {
    if (this.editor) {
      const image = this.editor.getImage()
      this.setState({newAvatarUrl: image.toDataURL()})
      image.toBlob(blob => {
        this.setState({newAvatarBlob: blob})
      })
    }
    this.setState({modalOpen: false})
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
          <form
            className='ui large form'
            warning={emailWarning && this.state.emailMessage !== ''}
            encType='multipart/form-data'
            acceptCharset='UTF-8'
            method='post'
            onSubmit={event => {
              event.preventDefault()
              const formData = new FormData(this.form);
              if (this.state.newAvatarBlob != null) {
                formData.append('user[avatar]', this.state.newAvatarBlob, 'avatar.png');
              }
              superagent.post('/accounts/profile')
              .send(formData)
              .set('Accept', 'application/json')
              .then(r => console.log(r.body))
            }}
            ref={form => this.form = form}
          >
            <input name='utf8' type='hidden' value='✓' />
            <input type='hidden' name='_method' value='put' />
            <input name='authenticity_token' type='hidden' />
            <semantic.Grid>
              <semantic.Grid.Column mobile={14} tablet={10} computer={8}>
                  {'Avatar'}
                  <semantic.Segment compact>
                    <label htmlFor='fileInput'>
                      <semantic.Image width={80} as='a' height={80} src={this.state.newAvatarUrl || this.state.user.avatar_url} />
                    </label>
                    <input
                      style={{
                        opacity: 0,
                        position: 'absolute',
                        zIndex: -1
                      }}
                      id='fileInput'
                      accept='image/png'
                      type='file'
                      onChange={this.setRawImage}
                    />
                    <semantic.Modal
                      open={this.state.modalOpen}
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
          </form>
        </semantic.Container>
      </div>
    )
  }
})

module.exports = Settings
