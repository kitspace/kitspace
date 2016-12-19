const Markdown = require('react-markdown')
const Redux    = require('redux')
const React    = require('react')
const {h}      = require('react-hyperscript-helpers')
const {Input, Icon, Step, Container, Form} = require('semantic-ui-react')
const request = require('superagent');

const TitleBar      = require('./title_bar')
const BoardShowcase = require('./board_showcase')


const initial_state = {
  activeStep: 0,
  request: {
    status: 'not sent',
    url: '',
    reply: null,
  },
}

function reducer(state = initial_state, action) {
  switch(action.type) {
    case 'setStep':
      return Object.assign(state, {activeStep: action.value})
    case 'setUrlSent': {
      const request = Object.assign(state.request, {url: action.value, status: 'sent'})
      return Object.assign(state, {request})
    }
    case 'setUrlResponse': {
      const request = Object.assign(state.request, {status: 'replied', reply: action.value})
      return Object.assign(state, {request})
    }
  }
  return state
}

const store = Redux.createStore(reducer)


const instructionTexts = [
`
- Plot Gerbers (RS274-X) & drill data from your CAD program.
- Put the files into a \`gerbers/\` directory in a publicly accessible git repository
(you could use [GitLab](https://gitlab.com) or [GitHub](https://github.com) for instance).

If you would like to put them somewhere else in your repository please also add a
kitnic.yaml with a field \`gerbers:\` followed by the path to the directory so Kitnic can find it.
Use forward slashes as path seperators, e.g. \`gerbers: hardware/gerbers\`.

Preview your board by entering the repository URL below.
`,
'',
'',
'',
]

function Steps(props) {
    return (
      <div className='stepsContainer'>
        <Step.Group ordered stackable='tablet'>
          <Step active={props.active === 0} onClick={handleClick(0)}>
            Preview the board
          </Step>
          <Step active={props.active === 1} onClick={handleClick(1)}>
            Preview the bill of materials
          </Step>
          <Step active={props.active === 2} onClick={handleClick(2)}>
            Preview the readme
          </Step>
          <Step active={props.active === 3} onClick={handleClick(3)}>
            Send us a pull-request to add your board
          </Step>
        </Step.Group>
      </div>
  )
}

const UrlSubmit = React.createClass({
  placeholder: 'https://github.com/kitnic-forks/arduino-uno',
  getInitialState() {
    return {url: ''}
  },
  onSubmit(event, {formData}) {
    event.preventDefault()
    if (this.props.request.status === 'sent') {
      return
    }
    if (formData.url === '') {
      formData.url = this.placeholder
      this.setState({url: this.placeholder})
    }
    store.dispatch({type:'setUrlSent', value: formData.url})
    request.post('https://git-clone-server.kitnic.it')
       .send({url: formData.url})
       .end((err, res) => {
         store.dispatch({type: 'setUrlResponse', value: res.body.data.files})
       })
  },
  onChange(event, input) {
    this.setState({url: input.value})
  },
  render() {
    const state = this.state
    const requestedUrl = this.props.request.url
    const requested = (state.url !== '') && (requestedUrl === state.url)
    const buttonText = requested ? 'Refresh' : 'Preview'
    const color = requested ? 'blue' : 'green'
    return (
      <Form onSubmit={this.onSubmit} id='submitForm'>
      <Input
        fluid
        name = 'url'
        onChange = {this.onChange}
        action = {{
          color,
          content : buttonText,
          loading : this.props.request.status === 'sent',
        }}
        placeholder = {this.placeholder}
        value = {state.url}
      />
      </Form>)
  },
})

const Submit = React.createClass({
  getInitialState() {
    return store.getState()
  },
  render() {
    const state = this.state
    return (
    <div className='Submit'>
      <TitleBar>
        <div className='titleText'>
          Submit a project
        </div>
      </TitleBar>
      <Container>
        <Steps active={state.activeStep} />
        <Markdown className='instructions' source={instructionTexts[state.activeStep]} />
        <UrlSubmit request={state.request} />
        <BoardShowcase />
      </Container>
    </div>
    )
  },
  componentDidMount() {
    store.subscribe(() => {
      const state = store.getState()
      console.log(state)
      this.setState(state)
    })
  }
})

function handleClick(step) {
   return () => {
      store.dispatch({type:'setStep', value:step})
   }
}

module.exports = Submit
