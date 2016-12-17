const React       = require('react')
const TitleBar    = require('./title_bar')

var Submit = React.createClass({
  getInitialState: function() {
    return null
  },
  render: function () {
    return (
      <div>
        <TitleBar>
            <div className='titleText'>
              Register a project
            </div>
        </TitleBar>
      </div>
    )
  },
  componentDidMount: function() {
  },
})

module.exports = Submit
