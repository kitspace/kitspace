const React           = require('react')
const request         = require('superagent')
const path            = require('path')
const camelCase       = require('lodash.camelcase')
const whatsThatGerber = require('whats-that-gerber')
const url             = require('url')
const jsYaml          = require('js-yaml')
const {
  Form,
  Button,
  Input,
} = require('semantic-ui-react')

const boardBuilder = require('../board_builder')

const GIT_CLONE_SERVER = 'https://git-clone-server.kitnic.it'

function isLoading(status) {
  return (status !== 'done') && (status !== 'not sent') && (status !== 'failed')
}

function buildBoard(store, layers) {
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


const UrlSubmit = React.createClass({
  placeholder: 'https://github.com/kitnic-forks/arduino-uno',
  getInitialState() {
    return {url: this.props.board.url || ''}
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
    this.props.store.dispatch({type:'setUrlSent', value: formData.url})
    request.post(GIT_CLONE_SERVER)
       .send({url: formData.url})
       .withCredentials()
       .end((err, res) => {
         if (err) {
           return this.props.store.dispatch({type: 'setBoardError', value: err})
         }
         if (res.body.error) {
           return this.props.store.dispatch({type: 'setBoardError', value: res.body.error})
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
                 this.props.store.dispatch({type: 'setYaml', value: info})
               }
             })
         }
         if (gerbers.length === 0) {
           this.props.store.dispatch({type: 'setBoardError', value:'No Gerber files found in repository'})
         }
         else {
           const requests = gerbers.map(f => {
             return request.get(url.resolve(GIT_CLONE_SERVER, f))
               .withCredentials()
               .then(res => ({gerber: res.text, filename: f}))
           })
           Promise.all(requests).then(buildBoard.bind(null, this.props.store))
           this.props.store.dispatch({type: 'setFileListing', value: files})
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

module.exports = UrlSubmit
