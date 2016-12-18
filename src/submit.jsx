const Markdown = require('react-markdown')

const React         = require('react')
const TitleBar      = require('./title_bar')

var Submit = React.createClass({
  getInitialState: function() {
    return null
  },
  render: function () {
    var input =
`# Step 1

- Plot Gerbers & drill data from you CAD program.
- Put the files into a \`gerbers/\` directory.
- Add this directory to a publicly accessible git repository.

If you would like to put them somewhere else in your repository please also add a
kitnic.yaml with a field \`gerbers:\` followed by the path to the directory
(using forward slashes as path seperators, e.g. \`gerbers: hardware/gerbers\`).

Preview your board by entering the repository URL below.
`

    return (
      <div>
        <TitleBar>
            <div className='titleText'>
              Submit a project
            </div>
        </TitleBar>
        <Markdown className='instructions' source={input} />
        <form>
          <input id='urlInput' type='url' />
          <input type='submit' value='preview'/>
        </form>
      </div>
    )
  },
  componentDidMount: function() {
  },
})

module.exports = Submit
