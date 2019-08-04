const React = require('react')
const Markdown = require('react-markdown')
const semantic = require('semantic-ui-react')

const util = require('./util')
const Steps = require('./steps')
const UrlSubmit = require('./url_submit')

const Bom = require('../buy_parts/bom')
const getPartinfo = require('../get_partinfo.js')

const PreviewBom = React.createClass({
  render() {
    const board = this.props.board
    const instructionText =
      'Add a [1-click-bom.tsv](https://github.com/kitspace/1clickBOM#usage)' +
      ' to the root of your repository.' +
      ' If you would like to put it in a different folder or call it something' +
      ' else, add a kitspace.yaml with:\n\n' +
      '```\n' +
      'bom: path/to/bom.tsv\n' +
      '```\n'
    const instructions = (
      <Markdown className="instructions" source={instructionText} />
    )
    let nextButton
    if (board.bom !== '') {
      nextButton = (
        <semantic.Button
          content="Next"
          icon="right arrow"
          labelPosition="right"
          color="green"
          onClick={this.props.setStep(3)}
        />
      )
    }
    let messages = board.bom.errors.map(message => {
      return util.message('Error', message)
    })
    messages = messages.concat(
      board.bom.warnings.map(message => {
        return util.message('Warning', message)
      })
    )
    return (
      <div className="Step Step2">
        <semantic.Container>
          <Steps setStep={this.props.setStep} active={2} />
          {instructions}
          <div className="userInputSegment">
            <UrlSubmit dispatch={this.props.dispatch} board={board} />
            <div className="nextButtonContainer">{nextButton}</div>
            <div className="messageContainer">{messages}</div>
          </div>
          {board.bom.tsv ? (
            <Bom parts={board.parts} tsv={board.bom.tsv} />
          ) : null}
        </semantic.Container>
      </div>
    )
  }
})

module.exports = PreviewBom
