const React    = require('react')
const Markdown = require('react-markdown')
const marky    = require('marky-markdown')
const semantic = require('semantic-ui-react')

const Steps     = require('./steps')
const UrlSubmit = require('./url_submit')

const TitleBar = require('../title_bar')

const Step3 = React.createClass({
  render() {
    const board = this.props.board
    let nextButton, instructionText
    if (board.readme) {
      nextButton = <semantic.Button
        content       = 'Next'
        icon          = 'right arrow'
        labelPosition = 'right'
        color         = 'green'
        onClick       = {this.props.setStep(4)} />
    }
    else if (board.status === 'done' || board.status === 'not sent'){
      instructionText = 'Add a README.md to your repository explaining more about'
      + ' the project. This should be written in [Markdown]'
      + '(http://commonmark.org/help/).'
    }
    return (
    <div className='Step Step3'>
      <TitleBar>
        <div className='titleText'>
          {'Submit a project'}
        </div>
      </TitleBar>
      <semantic.Container>
        <Steps setStep={this.props.setStep} active={3}/>
        <div className='userInputSegment'>
          <UrlSubmit dispatch={this.props.dispatch} board={board} />
          <div className='nextButtonContainer'>
            {nextButton}
          </div>
        </div>
        <Markdown className='instructions' source={instructionText} />
        {board.readme}
      </semantic.Container>
    </div>
    )
  },
})

module.exports = Step3
