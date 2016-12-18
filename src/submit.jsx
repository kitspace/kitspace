const Markdown = require('react-markdown')

const React     = require('react')
const { Input, Icon, Step } = require('semantic-ui-react')

const TitleBar  = require('./title_bar')

const instructionText =
`
- Plot Gerbers (RS274-X) & drill data from your CAD program.
- Put the files into a \`gerbers/\` directory in a publicly accessible git repository
(you could use [GitLab](https://gitlab.com) or [GitHub](https://github.com) for instance).

If you would like to put them somewhere else in your repository please also add a
kitnic.yaml with a field \`gerbers:\` followed by the path to the directory so Kitnic can find it.
Use forward slashes as path seperators, e.g. \`gerbers: hardware/gerbers\`.

Preview your board by entering the repository URL below.
`

const Steps = () => (
  <div>
    <Step.Group ordered>
      <Step active={true}>Preview the board</Step>
      <Step>Preview the bill of materials</Step>
      <Step>Preview the readme</Step>
    </Step.Group>
  </div>
)

var Submit = React.createClass({
  getInitialState: function() {
    return null
  },
  render: function () {
    return (
    <div>
      <TitleBar>
        <div className='titleText'>
          Submit a project
        </div>
      </TitleBar>
      <div className='content'>
        <Steps />
        <Markdown className='instructions' source={instructionText} />
        <div className='previewContainer'>
          <Input fluid action={{color:'green', content:'preview'}} placeholder='https://github.com/kitnic-forks/arduino-uno' />
        </div>
      </div>
    </div>
    )
  },
  componentDidMount: function() {
  },
})

module.exports = Submit
