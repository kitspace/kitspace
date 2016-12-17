const Markdown = require('react-markdown')

const React         = require('react')
const TitleBar      = require('./title_bar')

var Submit = React.createClass({
  getInitialState: function() {
    return null
  },
  render: function () {
    var input =`1. Export your plotted gerbers & drill data and put them into a \`gerbers/\` directory.
    If you would like to put them somewhere else please add a kitnic.yaml with a field \`gerbers:\` followed by the path to the directory.`

    return (
      <div>
        <TitleBar>
            <div className='titleText'>
              Register a project
            </div>
        </TitleBar>
        <Markdown className='instructions' source={input} />
      </div>
    )
  },
  componentDidMount: function() {
  },
})

module.exports = Submit
