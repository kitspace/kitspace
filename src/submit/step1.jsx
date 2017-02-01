const React    = require('react')
const Markdown = require('react-markdown')
const {
  Container,
  Button,
} = require('semantic-ui-react')


const Steps         = require('./steps')
const UrlSubmit     = require('./url_submit')
const ColorSelector = require('./color_selector')

const TitleBar      = require('../title_bar')
const BoardShowcase = require('../page/board_showcase')

const instruction_text = `
Plot Gerbers (RS274-X) and drill data from your CAD program. Put the files in a
publicly accessible Git repository (you could use [GitHub](https://github.com)
or [GitLab](https://gitlab.com) for instance). Preview your board by
entering the repository URL below.
`

const Step1 = React.createClass({
  render() {
    const board = this.props.board
    let showcase = (<div style={{height:450}} />)
    let colorSelector
    let nextButton
    if (board.svgs) {
      const top = board.svgs.top
      const bottom = board.svgs.bottom
      const yamlColor = (board.yaml || {}).color
      showcase = <div className={`pcb-${board.color}`}> <BoardShowcase>{top}{bottom}</BoardShowcase></div>
      colorSelector = <ColorSelector dispatch={this.props.dispatch} active={board.color} yamlColor={yamlColor} />
      nextButton = <Button content='Next' icon='right arrow' labelPosition='right' color='green' onClick={this.props.setStep(2)} />
    }
    return (
    <div className='Step Step1'>
      <TitleBar>
        <div className='titleText'>
          {'Submit a project'}
        </div>
      </TitleBar>
      <Container>
        <Steps setStep={this.props.setStep} active={1}/>
        <Markdown className='instructions' source={instruction_text} />
        <div className='userInputSegment'>
          <UrlSubmit dispatch={this.props.dispatch} board={board} />
          {colorSelector}
          {nextButton}
        </div>
        {showcase}
      </Container>
    </div>
    )
  },
})

module.exports = Step1
