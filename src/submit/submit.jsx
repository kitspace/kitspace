const Markdown        = require('react-markdown')
const Redux           = require('redux')
const React           = require('react')
const {h}             = require('react-hyperscript-helpers')
const request         = require('superagent')
const path            = require('path')
const camelCase       = require('lodash.camelcase')
const whatsThatGerber = require('whats-that-gerber')
const url             = require('url')
const {
  Input,
  Icon,
  Step,
  Container,
  Form,
  Segment,
  Button,
  Label,
  Checkbox,
  Message,
} = require('semantic-ui-react')

let DOMURL
if (typeof(window) !== 'undefined') {
  DOMURL = window.URL || window.webkitURL || window;
}

const TitleBar      = require('../title_bar')
const BoardShowcase = require('../page/board_showcase')
const boardBuilder    = require('../board_builder')

const GIT_CLONE_SERVER = 'https://git-clone-server.kitnic.it'

const board_colors = [
  'green',
  'red',
  'blue',
  'black',
  'white',
  'orange',
  'purple',
  'yellow',
]

const initial_state = {
  activeStep: 0,
  board: {
    status    : 'not sent',
    color     : 'green',
    yamlColor : null,
    url       : null,
    files     : null,
    svgs      : null,
    stackup   : null,
    messages  : [],
  },
}

function reducer(state = initial_state, action) {
  console.log(action)
  switch(action.type) {
    case 'setStep':
      return Object.assign(state, {activeStep: action.value})
    case 'setUrlSent': {
      const new_state = JSON.parse(JSON.stringify(initial_state))
      new_state.activeStep = state.activeStep
      new_state.board.status = 'sent'
      new_state.board.url = action.value
      return state
    }
    case 'setFileListing': {
      const board = Object.assign(state.board, {status: 'replied', files: action.value})
      return Object.assign(state, {board})
    }
    case 'setSvgs': {
      const {svgs} = action.value
      const board = Object.assign(state.board, {status: 'done', svgs})
      return Object.assign(state, {board})
    }
    case 'setColor': {
      const board = Object.assign(state.board, {color: action.value})
      return Object.assign(state, {board})
    }
    case 'setBoardError': {
      const board = Object.assign(state.board, {status: 'failed', messages: state.board.messages.concat([action.value])})
      return Object.assign(state, {board})
    }
  }
  return state
}

const store = Redux.createStore(reducer)


const instructionTexts = [
`
Plot Gerbers (RS274-X) & drill data from your CAD program. Put the files in a
publicly accessible Git repository (you could use [GitHub](https://github.com)
or [GitLab](https://gitlab.com) for instance). Preview your board by
entering the repository URL below.
`,
'',
'',
'',
]

function Steps(props) {
    return (
      <div className='stepsContainer'>
        <Step.Group ordered>
          <Step active={props.active === 0} onClick={setStep(0)}>
            {'Preview the board'}
          </Step>
          <Step active={props.active === 1} onClick={setStep(1)}>
            {'Preview the bill of materials'}
          </Step>
          <Step active={props.active === 2} onClick={setStep(2)}>
            {'Preview the readme'}
          </Step>
          <Step completed active={props.active === 3} onClick={setStep(3)}>
            {'Submit'}
          </Step>
        </Step.Group>
      </div>
  )
}


function gerberFiles(files, info) {
  return files.filter(f => whatsThatGerber(f) !== 'drw')
}

function isLoading(status) {
  return (status !== 'done') && (status !== 'not sent') && (status !== 'failed')
}

function createSvgDataUrl(string) {
  return DOMURL.createObjectURL(new Blob([string], {type: 'image/svg+xml'}))
}

function buildBoard(layers) {
    boardBuilder(layers, 'green', (err, stackup) => {
      if (err) {
        console.error(err)
        store.dispatch({type: 'setBoardError', value:err})
      }
      else {
        const top    = stackup.top.svg
        const bottom = stackup.bottom.svg
        const svgs = {top, bottom}
        store.dispatch({type: 'setSvgs', value: {svgs}})
      }
    }, createElement)
}

function createElement(type, props, children) {
  if (type === 'style') {
    return
  }
  Object.keys(props).forEach(key => {
    let newKey
    if (key === 'xmlns:xlink') {
      newKey = 'xmlnsXlink'
    }
    else if (key === 'xlink:href') {
      newKey = 'xlinkHref'
    }
    else if (key === 'class') {
      newKey = 'className'
    }
    else if (/-/.test(key)) {
      newKey = camelCase(key)
    }
    if (newKey && newKey !== key) {
      props[newKey] = props[key]
      delete props[key]
    }
  })
  return React.createElement(type, props, children)
}


function ColorSelector(props) {
  function changeColor(color) {
    return () => {
      store.dispatch({type: 'setColor', value: color})
    }
  }
  const buttons = board_colors.map(color => {
      const selected = props.active === color ? 'selected' : ''
      return h(Label, {
        circular: true,
        className : `colorSelect ${selected}`,
        onClick   : changeColor(color),
        id        : `${color}Button`
      })
  })
  let yamlInfo
  if (props.yamlColor == null) {
    if (props.active !== 'green') {
      yamlInfo =
        <Label attached='bottom right'>
          {`Add a kitnic.yaml with "color: ${props.active}" to\
            your repo to use this color`}
        </Label>
    }
  }
  else if (props.yamlColor !== props.active) {
    yamlInfo =
      <Label attached='bottom right'>
        {`Change the color in your kitnic.yaml to "color: \
          ${props.active}" to use this color`}
      </Label>
  }
  return (
    <Segment className='colorSelector'>
      <Label>
        {'Select a color:'}
      </Label>
      {buttons}
      {yamlInfo}
    </Segment>
  )
}

const UrlSubmit = React.createClass({
  placeholder: 'https://github.com/kasbah/test-repo',
  getInitialState() {
    return {url: ''}
  },
  onSubmit(event, {formData}) {
    event.preventDefault()
    if (isLoading(this.props.board.status)) {
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
         const files    = res.body.data.files
         const gerbers  = gerberFiles(files)
         console.log(gerbers)
         if (gerbers.length === 0) {
           console.log('setBoardError')
           store.dispatch({type: 'setBoardError', value:'No Gerber files found in repository'})
         }
         else {
           const requests = gerbers.map(f => {
             return request.get(url.resolve(GIT_CLONE_SERVER, f))
               .withCredentials()
               .then(res => ({gerber: res.text, filename: f}))
           })
           Promise.all(requests).then(buildBoard)
           store.dispatch({type: 'setFileListing', value: files})
         }
       })
  },
  onChange(event, input) {
    this.setState({url: input.value})
  },
  render() {
    const state      = this.state
    const requested  = state.url === this.props.board.url
    const color      = requested ? 'blue' : 'green'
    const loading    = isLoading(this.props.board.status)
    const failed     = this.props.board.status === 'failed'
    let message
    if (failed) {
      message =
        <Message
          error
          header='Preview Failed'
          content={this.props.board.messages[0]} />
    }
    let buttonText = 'Preview'
    if (requested) {
      buttonText = failed ? 'Retry' : 'Refresh'
    }
    return (
      <Form error={failed} onSubmit={this.onSubmit} id='submitForm'>
      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Input
          fluid
          name = 'url'
          onChange = {this.onChange}
          error = {failed}
          action = {{
            color,
            loading,
            content : buttonText,
            className: 'submitButton',
          }}
          placeholder = {this.placeholder}
          value = {state.url}
        />
      </div>
      {message}
      </Form>)
  },
})

const Submit = React.createClass({
  getInitialState() {
    return store.getState()
  },
  render() {
    const state = this.state
    let showcase
    let colorSelector
    let nextButton
    if (state.activeStep === 0 && state.board.svgs) {
      const top = state.board.svgs.top
      const bottom = state.board.svgs.bottom
      showcase = <div className={`pcb-${state.board.color}`}> <BoardShowcase>{top}{bottom}</BoardShowcase></div>
      colorSelector = <ColorSelector active={state.board.color} yamlColor={state.board.yamlColor} />
      nextButton = <Button content='Next' icon='right arrow' labelPosition='right' color='green' onClick={setStep(1)} />
    }
    return (
    <div className='Submit'>
      <TitleBar>
        <div className='titleText'>
          {'Submit a project'}
        </div>
      </TitleBar>
      <Container>
        <Steps active={state.activeStep} />
        <Markdown className='instructions' source={instructionTexts[state.activeStep]} />
        <div className='userInputSegment'>
          <UrlSubmit board={state.board} />
          {colorSelector}
          {nextButton}
        </div>
        {showcase}
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

function setStep(step) {
   return () => {
      store.dispatch({type:'setStep', value:step})
   }
}

module.exports = Submit
