const React    = require('react')
const Markdown = require('react-markdown')
const semantic = require('semantic-ui-react')

const Steps = require('./steps')
const UrlSubmit = require('./url_submit')

const TitleBar = require('../title_bar')


const Step2 = React.createClass({
  render() {
    const board = this.props.board
    let instructions = 'Add a 1-click-bom.tsv to the root of your repository.'
      + ' If you would like to put it in a different place'
      + ' add it to your kitnic.yaml:\n\n'
      + '```text\n'
      + 'bom: <your preferred location>\n'
      + '```'
    return (
    <div className='Step Step2'>
      <TitleBar>
        <div className='titleText'>
          {'Submit a project'}
        </div>
      </TitleBar>
      <semantic.Container>
        <Steps setStep={this.props.setStep} active={1}/>
        <div className='userInputSegment'>
          <UrlSubmit store={this.props.store} board={board} />
        </div>
        <Markdown className='instructions' source={instructions} />
      </semantic.Container>
    </div>
    )
  },
})

module.exports = Step2
