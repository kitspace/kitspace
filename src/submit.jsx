const Markdown        = require('react-markdown')
const Redux           = require('redux')
const React           = require('react')
const {h}             = require('react-hyperscript-helpers')
const request         = require('superagent')
const path            = require('path')
const pcbStackup      = require('pcb-stackup')
const whatsThatGerber = require('whats-that-gerber')
const url = require('url')
const {Input, Icon, Step, Container, Form} = require('semantic-ui-react')

const TitleBar      = require('./title_bar')
const BoardShowcase = require('./board_showcase')

const GIT_CLONE_SERVER = 'https://git-clone-server.kitnic.it'

const initial_state = {
  activeStep: 0,
  request: {
    status: 'not sent',
    url: null,
    files: null,
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
      const request = Object.assign(state.request, {status: 'replied', files: action.value})
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


function gerberFiles(files, info) {
  if (files.length < 1) {
    return []
  }
  const prefix = files[0].split('/').slice(0, 3).join('/')
  const relative = files.map(f => path.relative(prefix, f))
  let folder = 'gerbers'
  if (info != null) {
    folder = info.gerbers || folder
  }
  folder = path.join(folder, '/')
  return relative.filter(f => RegExp(`^${folder}`).test(f))
    .map(f => path.join(prefix, f))
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
    request.post(GIT_CLONE_SERVER)
       .send({url: formData.url})
       .withCredentials()
       .end((err, res) => {
         const files   = res.body.data.files
         const gerbers = gerberFiles(files)
         const promises = gerbers.map(f => {
           return new Promise((resolve, reject) => {
             request.get(url.resolve(GIT_CLONE_SERVER, f))
               .withCredentials()
               .end((err, res) => {
                  resolve({gerber: res.text, filename: f})
             })
           })
         })
         Promise.all(promises).then(layers => {
           pcbStackup(layers, (err, stackup) => {
             console.log(stackup.top.svg)
             console.log(stackup.bottom.svg)
           })
         })
         store.dispatch({type: 'setUrlResponse', value: files})
       })
  },
  onChange(event, input) {
    this.setState({url: input.value})
  },
  render() {
    const state      = this.state
    const requested  = state.url === this.props.request.url
    const buttonText = requested ? 'Refresh' : 'Preview'
    const color      = requested ? 'blue' : 'green'
    const loading    = this.props.request.status === 'sent'
    return (
      <Form onSubmit={this.onSubmit} id='submitForm'>
      <Input
        fluid
        name = 'url'
        onChange = {this.onChange}
        action = {{
          color,
          loading,
          content : buttonText,
          className: 'submitButton',
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
