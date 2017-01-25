const Markdown        = require('react-markdown')
const Redux           = require('redux')
const React           = require('react')
const {h}             = require('react-hyperscript-helpers')
const request         = require('superagent')
const path            = require('path')
const camelCase       = require('lodash.camelcase')
const whatsThatGerber = require('whats-that-gerber')
const url             = require('url')
const immutable       = require('immutable')
const jsYaml          = require('js-yaml');
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

const initial_state = immutable.Map({
  activeStep: 0,
  board: immutable.Map({
    status    : 'not sent',
    color     : 'green',
    yaml      : immutable.Map({}),
    url       : null,
    files     : null,
    svgs      : null,
    stackup   : null,
    message   : '',
  }),
})

function reducer(state = initial_state, action) {
  console.log(action)
  switch(action.type) {
    case 'setStep':
      return state.set('activeStep', action.value)
    case 'setUrlSent': {
      const board = initial_state.get('board').set('status', 'sent')
        .set('url', action.value)
      return state.set('board', board)
    }
    case 'setFileListing': {
      const board = state.get('board').set('status', 'replied')
        .set('files', action.value)
      return state.set('board', board)
    }
    case 'setSvgs': {
      const {svgs} = action.value
      const board = state.get('board').set('status', 'done')
        .set('svgs', svgs)
      return state.set('board', board)
    }
    case 'setColor': {
      const board = state.get('board').set('color', action.value)
      return state.set('board', board)
    }
    case 'setYaml': {
      const info = action.value
      let board = state.get('board').set('yaml', immutable.Map(info))
      if (info.color) {
        if (board_colors.indexOf(info.color) >= 0) {
          board = board.set('color', info.color)
        } else {
          //TODO: warning
        }
      }
      return state.set('board', board)
    }
    case 'setBoardError': {
      const board = state.get('board').set('status', 'failed')
        .set('message', action.value)
      return state.set('board', board)
    }
  }
  return state
}

const store = Redux.createStore(reducer)


const instructionTexts = [
`
Plot Gerbers (RS274-X) and drill data from your CAD program. Put the files in a
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
  const layers = files.map(f => ({path: f, type: whatsThatGerber(f)}))
    .filter(({type}) => type !== 'drw')
  const possibleGerbers = layers.map(({path}) => path)
  const possibleTypes = layers.map(({type}) => type)
  const duplicates = possibleTypes.reduce((prev, t) => {
    return prev || (possibleTypes.indexOf(t) !== possibleTypes.lastIndexOf(t))
  }, false)
  if (! duplicates) {
    return possibleGerbers
  }
  //if we have duplicates we reduce it down to the folder with the most
  //gerbers
  const folders = possibleGerbers.reduce((folders, f) => {
    const name = path.dirname(f)
    folders[name] = (folders[name] || 0) + 1
    return folders
  }, {})
  const gerberFolder = Object.keys(folders).reduce((prev, f) => {
    if (folders[f] > folders[prev]) {
      return f
    }
    return prev
  })
  return possibleGerbers.filter(f => path.dirname(f) === gerberFolder)
}


function kitnicYaml(files) {
  const yaml = files.filter(f => RegExp('/.*?/.*?/kitnic.yaml').test(f))
  if (yaml.length > 0) {
    return yaml[0]
  }
  return null
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
         if (err) {
           return store.dispatch({type: 'setBoardError', value: err})
         }
         if (res.body.error) {
           return store.dispatch({type: 'setBoardError', value: res.body.error})
         }
         const files    = res.body.data.files
         const gerbers  = gerberFiles(files)
         const yaml     = kitnicYaml(files)
         if (yaml) {
           request.get(url.resolve(GIT_CLONE_SERVER, yaml))
             .withCredentials()
             .then(res => {
               const info = jsYaml.safeLoad(res.text)
               if (info)  {
                 store.dispatch({type: 'setYaml', value: info})
               }
             })
         }
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
          content={this.props.board.message} />
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
    return store.getState().toJS()
  },
  render() {
    const state = this.state
    let showcase = (<div style={{height:450}} />)
    let colorSelector
    let nextButton
    if (state.activeStep === 0 && state.board.svgs) {
      const top = state.board.svgs.top
      const bottom = state.board.svgs.bottom
      showcase = <div className={`pcb-${state.board.color}`}> <BoardShowcase>{top}{bottom}</BoardShowcase></div>
      colorSelector = <ColorSelector active={state.board.color} yamlColor={state.board.yaml.color} />
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
      const state = store.getState().toJS()
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
