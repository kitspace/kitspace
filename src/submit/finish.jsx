const React = require('react')
const Markdown = require('react-markdown')
const {Container} = require('semantic-ui-react')

const Steps = require('./steps')
const UrlSubmit = require('./url_submit')

const Step4 = React.createClass({
  render() {
    const board = this.props.board
    const url = board.url ? `\`${board.url}\`` : 'your URL'
    const instructionText =
      'Please [edit the boards.txt]' +
      '(https://github.com/monostable/kitspace/edit/master/boards.txt)' +
      ' file on GitHub. Add' +
      ` ${url} and send us a pull request with your change.`
    return (
      <div className="Step Step4">
        <Container>
          <Steps setStep={this.props.setStep} active={4} />
          <div
            style={{marginTop: 30, display: 'flex', justifyContent: 'center'}}
          >
            <Markdown className="instructions" source={instructionText} />
          </div>
          <div
            style={{marginTop: 30, display: 'flex', justifyContent: 'center'}}
          >
            <img style={{height: 200}} src="/images/fireworks.png" />
          </div>
        </Container>
      </div>
    )
  }
})

module.exports = Step4
