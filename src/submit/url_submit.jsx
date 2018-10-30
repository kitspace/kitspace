const React = require('react')
const superagent = require('superagent')
const path = require('path')
const camelCase = require('lodash.camelcase')
const marky = require('marky-markdown')
const url = require('url')
const jsYaml = require('js-yaml')
const htmlToReact = new new require('html-to-react').Parser(React)
const githubUrlToObject = require('github-url-to-object')
const oneClickBOM = require('1-click-bom')

const gerberFiles = require('../gerber_files')
const getPartinfo = require('../get_partinfo')

const {Form, Button, Input, Message} = require('semantic-ui-react')

const boardBuilder = require('../board_builder')

const GIT_CLONE_SERVER = 'https://git-clone-server.kitspace.org'

function getGithubSummary(repoUrl, dispatch) {
  const repoInfo = githubUrlToObject(repoUrl)
  if (repoInfo) {
    superagent(repoInfo.api_url).end((err, res) => {
      if (err) {
        return
      }
      dispatch({type: 'setSummary', value: res.body.description})
    })
  }
}

function getBom(root, bomPath, dispatch) {
  bomPath = bomPath || '1-click-bom.tsv'
  superagent
    .get(url.resolve(GIT_CLONE_SERVER, path.join(root, bomPath)))
    .withCredentials()
    .end((err, res) => {
      if (err) {
        return
      }
      const {lines, errors, warnings} = oneClickBOM.parse(res.text)
      if (errors) {
        errors.forEach(message => {
          dispatch({type: 'reportError', value: {type: 'bom', message}})
        })
      }
      if (warnings) {
        warnings.forEach(message => {
          dispatch({type: 'reportWarning', value: {type: 'bom', message}})
        })
      }
      if (lines && lines.length > 0) {
        const bom = oneClickBOM.writeTSV(lines)
        dispatch({type: 'setBom', value: bom})
        getPartinfo(lines).then(parts => {
          dispatch({type: 'setParts', value: parts})
        })
      } else {
        dispatch({
          type: 'reportError',
          value: {type: 'bom', message: 'Could not find any complete lines in your BOM'}
        })
      }
    })
}

function findReadme(files) {
  const pattern = /^readme(\.markdown|\.mdown|\.mkdn|\.md)$/i
  const matches = files.filter(f => pattern.test(f))
  if (matches.length > 0) {
    return matches[0]
  }
  return null
}

function isLoading(status) {
  return status !== 'done' && status !== 'not sent' && status !== 'failed'
}

function buildBoard(dispatch, layers) {
  boardBuilder(
    layers,
    'green',
    (err, stackup) => {
      if (err) {
        console.error(err)
        dispatch({type: 'reportError', value: {type: 'gerbers', message: err}})
      } else {
        const top = stackup.top.svg
        const bottom = stackup.bottom.svg
        const svgs = {top, bottom}
        dispatch({type: 'setSvgs', value: {svgs}})
      }
    },
    createElement
  )
}

function createElement(type, props, children) {
  if (type === 'style') {
    return
  }
  Object.keys(props).forEach(key => {
    let newKey
    if (key === 'xmlns:xlink') {
      newKey = 'xmlnsXlink'
    } else if (key === 'xlink:href') {
      newKey = 'xlinkHref'
    } else if (key === 'class') {
      newKey = 'className'
    } else if (/-/.test(key)) {
      newKey = camelCase(key)
    }
    if (newKey && newKey !== key) {
      props[newKey] = props[key]
      delete props[key]
    }
  })
  return React.createElement(type, props, children)
}

function kitspaceYaml(files) {
  const yaml = files.filter(f => RegExp('^(kitspace|kitnic).ya?ml$').test(f))
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
  onSubmit(event) {
    const {board, dispatch} = this.props
    event.preventDefault()
    if (isLoading(board.status)) {
      return
    }
    let gitUrl = this.state.url
    if (gitUrl === '') {
      gitUrl = this.placeholder
      this.setState({url: this.placeholder})
    }
    dispatch({type: 'setUrlSent', value: gitUrl})
    superagent
      .post(GIT_CLONE_SERVER)
      .send({url: gitUrl})
      .withCredentials()
      .end((err, res) => {
        if (err) {
          return dispatch({type: 'reportNetworkError', value: err})
        }
        if (res.body.error) {
          return dispatch({type: 'reportNetworkError', value: res.body.error})
        }
        const files = res.body.data.files
        const root = res.body.data.root
        const yaml = kitspaceYaml(files)
        const readme = findReadme(files)
        if (readme) {
          superagent
            .get(url.resolve(GIT_CLONE_SERVER, path.join(root, readme)))
            .withCredentials()
            .then(res => {
              const pkg = {repository: {url: gitUrl}}
              const html = marky(res.text, {package: pkg}).html()
              const component = htmlToReact.parse(
                `<div class='readme'>${html}</div>`
              )
              dispatch({type: 'setReadme', value: component})
            })
            .catch(err => {
              console.error(err)
              dispatch({
                type: 'reportError',
                value: {
                  type: 'readme',
                  message: 'README could not be retrieved'
                }
              })
            })
        } else {
          dispatch({
            type: 'reportError',
            value: {type: 'readme', message: 'No README found in repository'}
          })
        }
        let p = Promise.resolve({})
        let info
        if (yaml) {
          p = superagent
            .get(url.resolve(GIT_CLONE_SERVER, path.join(root, yaml)))
            .withCredentials()
            .then(res => {
              const info = jsYaml.safeLoad(res.text)
              if (info) {
                dispatch({type: 'setYaml', value: info})
                getBom(root, info.bom, dispatch)
              } else {
                getBom(root, null, dispatch)
              }
              if (!(info && info.summary)) {
                getGithubSummary(gitUrl, dispatch)
              }
              return info || {}
            })
        } else {
          getBom(root, null, dispatch)
        }
        return p.then(info => {
          const gerbers = gerberFiles(files, info.gerbers)
          if (gerbers.length === 0) {
            dispatch({
              type: 'reportError',
              value: {
                type: 'gerbers',
                message: 'No Gerber files found in repository'
              }
            })
          } else {
            const requests = gerbers.map(f => {
              return superagent
                .get(url.resolve(GIT_CLONE_SERVER, path.join(root, f)))
                .withCredentials()
                .then(res => ({gerber: res.text, filename: path.basename(f)}))
            })
            Promise.all(requests).then(buildBoard.bind(null, dispatch))
            dispatch({type: 'setFileListing', value: files})
          }
        })
      })
  },
  onChange(event, input) {
    this.setState({url: input.value})
  },
  render() {
    const state = this.state
    const requested = state.url === this.props.board.url
    const color = requested ? 'blue' : 'green'
    const loading = isLoading(this.props.board.status)
    const failed = this.props.board.status === 'failed'
    let message
    if (failed) {
      message = (
        <Message error>
          <Message.Header>{'Preview Failed'}</Message.Header>
          <p>{this.props.board.message}</p>
        </Message>
      )
    }
    let buttonText = 'Preview'
    if (requested) {
      buttonText = failed ? 'Retry' : 'Refresh'
    }
    return (
      <Form error={failed} onSubmit={this.onSubmit} id="submitForm">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Input
            fluid
            name="url"
            onChange={this.onChange}
            error={failed}
            action={{
              color,
              loading,
              content: buttonText,
              className: 'submitButton'
            }}
            placeholder={this.placeholder}
            value={state.url}
          />
        </div>
        {message}
      </Form>
    )
  }
})

module.exports = UrlSubmit
