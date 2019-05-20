const React = require('react')
const {Button} = require('semantic-ui-react')

var TitleBar = React.createClass({
  propTypes: {
    children: React.PropTypes.any,
    submissionButton: React.PropTypes.bool
  },
  render: function() {
    let button
    if (this.props.submissionButton) {
      button = (
        <Button color="green" onClick={() => (location.href = '/submit')}>
          Submit a project
        </Button>
      )
    } else {
      button = null
    }
    return (
      <div className="titleBar">
        <div className="logoContainer">
          <a href="/">
            <img className="logoImg" src="/images/logo.svg" />
          </a>
        </div>
        <div className="middleContainer">{this.props.children}</div>
        <div className="submitContainer">
          {button}
          <a
            className="contributeContainer"
            title="Star Kitspace on GitHub"
            href="https://github.com/monostable/kitspace/"
          >
            <div className="contributeButton">
              <span className="octicon octicon-mark-github githubIcon" />
            </div>
          </a>
        </div>
      </div>
    )
  }
})

module.exports = TitleBar
