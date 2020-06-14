const React = require('react')
const Markdown = require('react-markdown')
const {Container} = require('semantic-ui-react')

const Steps = require('./steps')
const UrlSubmit = require('./url_submit')

const terms_and_conditions = `

### Terms and Conditions

1. We (Kitspace developers) do not claim any ownership over your work, it remains yours.
2. By submitting your project you give us permission to host copies of your files for other people to download.
3. If you change your mind, you can remove your project any time by removing the public git repository, sending a pull-request to remove it from [\`boards.txt\`](https://github.com/kitspace/kitspace/blob/master/boards.txt) or notifying [@kasbah](https://github.com/kasbah) in some other way.

`

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
            <Markdown className="instructions" source={terms_and_conditions} />
          </div>
        </Container>
      </div>
    )
  }
})

module.exports = Step4
