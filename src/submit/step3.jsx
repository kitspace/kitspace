const React    = require('react')
const Markdown = require('react-markdown')
const marky    = require('marky-markdown')
const semantic = require('semantic-ui-react')

const Steps     = require('./steps')
const UrlSubmit = require('./url_submit')

const TitleBar = require('../title_bar')
const InfoBar  = require('../page/info_bar')

const Step3 = React.createClass({
  render() {
    const board = this.props.board
    let nextButton, infoBar
    if (board.yaml) {
      const info = board.yaml
      info.repo = board.url
      infoBar = (
        <semantic.Segment>
          <InfoBar info={info} />
        </semantic.Segment>
      )
    }
    if (board.readme) {
      nextButton = <semantic.Button
        content       = 'Next'
        icon          = 'right arrow'
        labelPosition = 'right'
        color         = 'green'
        onClick       = {this.props.setStep(4)} />
    }
    const instructionText = 'Add a README.md to your repository explaining more'
      + ' about the project. This should be written in [Markdown]'
      + '(http://commonmark.org/help/).'
      + ' You can also add a summary and a link to your kitnic.yaml that will'
      + ' appear at the top of your page:'
      + '\n\n```\n'
      + 'summary: <a summary for your project>\n'
      + 'site: https://example.com\n'
      + '```\n'
    return (
    <div className='Step Step3'>
      <TitleBar>
        <div className='titleText'>
          {'Submit a project'}
        </div>
      </TitleBar>
      <semantic.Container>
        <Steps setStep={this.props.setStep} active={3}/>
        <Markdown className='instructions' source={instructionText} />
        <div className='userInputSegment'>
          <UrlSubmit dispatch={this.props.dispatch} board={board} />
          <div className='nextButtonContainer'>
            {nextButton}
          </div>
        </div>
        {infoBar}
        {board.readme}
      </semantic.Container>
    </div>
    )
  },
})

module.exports = Step3
