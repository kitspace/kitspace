const React = require('react')
const Markdown = require('react-markdown')
const semantic = require('semantic-ui-react')

const util = require('./util')
const Steps = require('./steps')
const UrlSubmit = require('./url_submit')

const InfoBar = require('../page/info_bar')

const Step3 = React.createClass({
  render() {
    const board = this.props.board
    let nextButton, infoBar
    let text = board.yaml
      ? ''
      : 'Add a kitspace.yaml with "summary" and' +
        ' "site" fields to appear at the top of your page'
    if (board.status === 'done') {
      const info = board.yaml || {}
      info.repo = board.url
      const url = new URL(board.url)
      info.id = url.host + url.pathname
      infoBar = (
        <semantic.Segment>
          <InfoBar info={info} />
          <semantic.Label attached="top left">{text}</semantic.Label>
        </semantic.Segment>
      )
    }
    if (board.readme.rendered) {
      nextButton = (
        <semantic.Button
          content="Next"
          icon="right arrow"
          labelPosition="right"
          color="green"
          onClick={this.props.setStep(4)}
        />
      )
    }
    const instructionText =
      'Add a README.md to your repository explaining more' +
      ' about the project. This should be written in [Markdown]' +
      '(http://commonmark.org/help/).' +
      ' You can also add a summary and a link to your kitspace.yaml that will' +
      ' appear at the top of your page:' +
      '\n\n```\n' +
      'summary: <a summary for your project>\n' +
      'site: https://example.com\n' +
      '```\n'
    let messages = board.readme.errors.map(message => {
      return util.message('Error', message)
    })
    messages = messages.concat(
      board.readme.warnings.map(message => {
        return util.message('Warning', message)
      })
    )
    return (
      <div className="Step Step3">
        <semantic.Container>
          <Steps setStep={this.props.setStep} active={3} />
          <Markdown className="instructions" source={instructionText} />
          <div className="userInputSegment">
            <UrlSubmit dispatch={this.props.dispatch} board={board} />
            <div className="nextButtonContainer">{nextButton}</div>
            <div className="messageContainer">{messages}</div>
          </div>
          {infoBar}
          {board.readme.rendered}
        </semantic.Container>
      </div>
    )
  }
})

module.exports = Step3
