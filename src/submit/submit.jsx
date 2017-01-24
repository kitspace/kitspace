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
    yamlColor : 'green',
    url       : null,
    files     : null,
    svgs      : null,
    stackup   : null,
  },
}

function reducer(state = initial_state, action) {
  switch(action.type) {
    case 'setStep':
      return Object.assign(state, {activeStep: action.value})
    case 'setUrlSent': {
      const board = Object.assign(state.board, {url: action.value, status: 'sent'})
      return Object.assign(state, {board})
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
  }
  return state
}

const store = Redux.createStore(reducer)


const instructionTexts = [
`
Plot Gerbers (RS274-X) & drill data from your CAD program. Put the files in a
publicly accessible Git repository (you could use [GitHub](https://github.com)
or [GitLab](https://gitlab.com) for instance) then preview your board by
entering the repository URL below.
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
  return files.filter(f => whatsThatGerber(f) !== 'drw')
}

function isLoading(status) {
  return (status !== 'done') && (status !== 'not sent')
}

function createSvgDataUrl(string) {
  return DOMURL.createObjectURL(new Blob([string], {type: 'image/svg+xml'}))
}

function buildBoard(layers) {
    boardBuilder(layers, 'green', (err, stackup) => {
      if (err) {
        console.error(err)
      } else {
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
  if (props.active !== props.yamlColor) {
    yamlInfo = <Label attached='bottom right'>{`Add a kitnic.yaml with "color: ${props.active}" to your repo to use this color.`}</Label>
  }
  return (
    <Segment className='colorSelector'>
      <Label>
        Select a color:
      </Label>
      {buttons}
      {yamlInfo}
    </Segment>
  )
}

const UrlSubmit = React.createClass({
  placeholder: 'https://github.com/kitnic-forks/arduino-uno',
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
         const requests = gerbers.map(f => {
           return request.get(url.resolve(GIT_CLONE_SERVER, f))
             .withCredentials()
             .then(res => ({gerber: res.text, filename: f}))
         })
         Promise.all(requests).then(buildBoard)
         store.dispatch({type: 'setFileListing', value: files})
       })
  },
  onChange(event, input) {
    this.setState({url: input.value})
  },
  render() {
    const state      = this.state
    const requested  = state.url === this.props.board.url
    const buttonText = requested ? 'Refresh' : 'Preview'
    const color      = requested ? 'blue' : 'green'
    const loading    = isLoading(this.props.board.status)
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
    let showcase
    let colorSelector
    if (state.board.svgs) {
      const top = state.board.svgs.top
      const bottom = state.board.svgs.bottom
      showcase = <div className={`pcb-${state.board.color}`}> <BoardShowcase>{top}{bottom}</BoardShowcase></div>
      colorSelector = <ColorSelector active={state.board.color} yamlColor={state.board.yamlColor} />
    }
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
        <UrlSubmit board={state.board} />
        {colorSelector}
        {showcase}
      </Container>
    </div>
    )
  },
  componentDidMount() {
    store.subscribe(() => {
      const state = store.getState()
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
