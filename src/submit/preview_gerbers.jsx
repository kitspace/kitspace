const React = require('react')
const createClass = require('create-react-class')
const Markdown = require('react-markdown')
const {Container, Button} = require('semantic-ui-react')

const util = require('./util')
const Steps = require('./steps')
const UrlSubmit = require('./url_submit')
const ColorSelector = require('./color_selector')

const BoardShowcase = require('../page/board_showcase')

const instruction_text = `
Plot Gerbers (RS274-X) and drill data from your CAD program. Put the files in a
publicly accessible Git repository (you could use [GitHub](https://github.com)
or [GitLab](https://gitlab.com) for instance). Preview your board by
entering the repository URL below.

(Note: adding multiple projects in one repository, and using .kicad_pcb instead of Gerbers _is_ supported by Kitspace but not by this preview yet. See the [docs](https://github.com/kitspace/kitspace#adding-your-project).)

If you think it hasn't found the right gerbers you can add [kitspace.yaml](https://github.com/kitspace/kitspace#kitspaceyaml-format)
with a gerbers field.

    gerbers: path/to/your/gerber-folder



If you run into any other problems please get in touch via
[Element chat](https://app.element.io/#/room/#kitspace:matrix.org)
, IRC (irc.libera.chat#kitspace) or [Github Issues](https://github.com/kitspace/kitspace/issues).
You can also use the [Tracespace Viewer](http://viewer.tracespace.io) to try
and figure out any issues with the board rendering.

### Terms and Conditions

1. We (Kitspace developers) do not claim any ownership over your work, it remains yours.
2. By submitting your project you give us permission to host copies of your files for other people to download.
3. If you change your mind, you can remove your project any time by removing the public git repository, sending a pull-request to remove it from [\`boards.txt\`](https://github.com/kitspace/kitspace/blob/master/boards.txt) or notifying [@kasbah](https://github.com/kasbah) in some other way.


`

const Step1 = createClass({
  render() {
    const board = this.props.board
    let showcase = <div style={{height: 450}} />
    let colorSelector
    let nextButton
    if (board.svgs) {
      const top = board.svgs.top
      const bottom = board.svgs.bottom
      const yamlColor = (board.yaml || {}).color
      showcase = (
        <div className={`pcb-${board.color}`}>
          <BoardShowcase>
            <div dangerouslySetInnerHTML={{__html: top}} />
            <div dangerouslySetInnerHTML={{__html: bottom}} />
          </BoardShowcase>
        </div>
      )
      colorSelector = (
        <ColorSelector
          dispatch={this.props.dispatch}
          active={board.color}
          yamlColor={yamlColor}
        />
      )
      nextButton = (
        <Button
          content="Next"
          icon="right arrow"
          labelPosition="right"
          color="green"
          onClick={this.props.setStep(2)}
        />
      )
    }
    let messages = board.gerbers.errors.map(message => {
      return util.message('Error', message)
    })
    messages = messages.concat(
      board.gerbers.warnings.map(message => {
        return util.message('Warning', message)
      })
    )
    return (
      <div className="Step Step1">
        <Container>
          <Steps setStep={this.props.setStep} active={1} />
          <Markdown className="instructions" source={instruction_text} />
          <div className="userInputSegment">
            <UrlSubmit dispatch={this.props.dispatch} board={board} />
            <div className="messageContainer">{messages}</div>
            {colorSelector}
            {nextButton}
          </div>
          {showcase}
        </Container>
      </div>
    )
  }
})

module.exports = Step1
